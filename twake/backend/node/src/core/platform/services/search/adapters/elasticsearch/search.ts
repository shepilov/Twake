import { RequestParams } from "@elastic/elasticsearch";
import { TransportRequestOptions } from "@elastic/elasticsearch/lib/Transport";
import _ from "lodash";
import { logger } from "../../../../../../core/platform/framework/logger";
import { EntityTarget, FindFilter, FindOptions, getEntityDefinition } from "../../api";
import { asciiFold } from "../utils";

export function buildSearchQuery<Entity>(
  entityType: EntityTarget<Entity>,
  filters: FindFilter,
  options: FindOptions = {},
): { esParams: RequestParams.Search; esOptions: TransportRequestOptions } {
  const instance = new (entityType as any)();
  const { entityDefinition, columnsDefinition } = getEntityDefinition(instance);
  const indexProperties = entityDefinition.options.search.esMapping.properties || {};

  let esBody: any = {
    query: {
      bool: {
        boost: 1.0,
      },
    },
  };

  if (Object.keys(filters || {}).length > 0) {
    esBody.query.bool.must = esBody.query.bool.must || [];
    for (const [key, value] of Object.entries(filters)) {
      let match: any = {};
      match[key] = { query: value, operator: "AND" };
      esBody.query.bool.must.push({ match });
    }
  }

  if (options.$in?.length) {
    esBody.query.bool.must = esBody.query.bool.must || [];
    for (const inOperation of options.$in) {
      if (inOperation[1].length > 0) {
        let bool: any = { bool: { should: [], minimum_should_match: 1 } };
        for (const value of inOperation[1]) {
          let match: any = {};
          match[inOperation[0]] = { query: value, operator: "AND" };
          bool.bool.should.push({ match });
        }
        esBody.query.bool.must.push(bool);
      }
    }
  }

  //TODO implement $gte, $lt, etc

  if (options.$text) {
    esBody.query.bool.minimum_should_match = 1;
    esBody.query.bool.should = esBody.query.bool.should || [];

    if (options?.$text?.$search)
      options.$text.$search = asciiFold(options.$text.$search || "").toLocaleLowerCase();

    for (const [key, value] of Object.entries(indexProperties)) {
      if ((value as any)["type"] === "text") {
        let match: any = {};
        match[key] = {
          query: (options.$text.$search || "").toLocaleLowerCase(),
        };
        esBody.query.bool.should.push({
          match,
        });

        //Allow prefix search
        if (indexProperties[key].index_prefixes !== undefined) {
          esBody.query.bool.should.push({
            prefix: { [key]: { value: (options.$text.$search || "").toLocaleLowerCase() } },
          });
        }
      }
    }
  }

  //TODO implement regex search

  logger.debug(`Elasticsearch query: ${JSON.stringify(esBody)}`);

  const esParams: RequestParams.Search = {
    index: entityDefinition.options?.search?.index || entityDefinition.name,
    body: esBody,
  };

  let esOptions: TransportRequestOptions = {
    ignore: [404],
    maxRetries: 3,
  };

  return {
    esParams,
    esOptions,
  };
}
