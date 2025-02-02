import { Message } from "./messages";

export default {
  index: "messages",
  source: (entity: Message) => {
    const source: any = {
      text: entity.text + " " + (entity.files || []).map(file => file.metadata.name).join(" "),
      has_files: (entity.files || []).length > 0,
    };
    if (entity.cache) {
      return {
        company_id: entity.cache?.company_id,
        workspace_id: entity.cache?.workspace_id,
        channel_id: entity.cache?.channel_id,
        user_id: entity.user_id,
        ...source,
      };
    }
    return source;
  },
  mongoMapping: {
    text: {
      text: "text",
    },
  },
  esMapping: {
    properties: {
      text: { type: "text" },
      user_id: { type: "keyword" },
      company_id: { type: "keyword" },
      workspace_id: { type: "keyword" },
      channel_id: { type: "keyword" },
      has_files: { type: "boolean" },
    },
  },
};
