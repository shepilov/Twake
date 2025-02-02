import { FastifyInstance, FastifyPluginCallback } from "fastify";
import { RealtimeServiceAPI } from "../../../core/platform/services/realtime/api";
import { MessageServiceAPI } from "../api";
import {
  MessagesController,
  ThreadsController,
  UserBookmarksController,
  ViewsController,
} from "./controllers";
import WorkspaceServicesAPI from "../../workspaces/api";
import ChannelServiceAPI from "../../channels/provider";

const routes: FastifyPluginCallback<{
  service: MessageServiceAPI;
  realtime: RealtimeServiceAPI;
  workspaceService: WorkspaceServicesAPI;
  channelService: ChannelServiceAPI;
}> = (fastify: FastifyInstance, options, next) => {
  const threadsController = new ThreadsController(options.service);
  const messagesController = new MessagesController(options.realtime, options.service);
  const userBookmarksController = new UserBookmarksController(options.realtime, options.service);
  const viewsController = new ViewsController(
    options.realtime,
    options.service,
    options.workspaceService,
    options.channelService,
  );

  /**
   * User bookmarks collection
   */
  fastify.route({
    method: "GET",
    url: "/companies/:company_id/preferences/bookmarks",
    preValidation: [fastify.authenticate],
    handler: userBookmarksController.list.bind(userBookmarksController),
  });

  fastify.route({
    method: "POST",
    url: "/companies/:company_id/preferences/bookmarks/:id",
    preValidation: [fastify.authenticate],
    handler: userBookmarksController.save.bind(userBookmarksController),
  });

  fastify.route({
    method: "POST",
    url: "/companies/:company_id/preferences/bookmarks",
    preValidation: [fastify.authenticate],
    handler: userBookmarksController.save.bind(userBookmarksController),
  });

  fastify.route({
    method: "DELETE",
    url: "/companies/:company_id/preferences/bookmarks/:id",
    preValidation: [fastify.authenticate],
    handler: userBookmarksController.delete.bind(userBookmarksController),
  });

  /**
   * Threads creation route
   */
  fastify.route({
    method: "POST",
    url: "/companies/:company_id/threads",
    preValidation: [fastify.authenticate],
    handler: threadsController.save.bind(threadsController),
  });

  fastify.route({
    method: "POST",
    url: "/companies/:company_id/threads/:thread_id",
    preValidation: [fastify.authenticate],
    handler: threadsController.save.bind(threadsController),
  });

  /**
   * In threads message collection
   */
  fastify.route({
    method: "POST",
    url: "/companies/:company_id/threads/:thread_id/messages",
    preValidation: [fastify.authenticate],
    handler: messagesController.save.bind(messagesController),
  });

  fastify.route({
    method: "POST",
    url: "/companies/:company_id/threads/:thread_id/messages/:message_id",
    preValidation: [fastify.authenticate],
    handler: messagesController.save.bind(messagesController),
  });

  fastify.route({
    method: "GET",
    url: "/companies/:company_id/threads/:thread_id/messages/:message_id",
    preValidation: [fastify.authenticate],
    handler: messagesController.get.bind(messagesController),
  });

  fastify.route({
    method: "GET",
    url: "/companies/:company_id/threads/:thread_id/messages",
    preValidation: [fastify.authenticate],
    handler: messagesController.list.bind(messagesController),
  });

  fastify.route({
    method: "DELETE",
    url: "/companies/:company_id/threads/:thread_id/messages/:message_id",
    preValidation: [fastify.authenticate],
    handler: messagesController.forceDelete.bind(messagesController),
  });

  fastify.route({
    method: "POST",
    url: "/companies/:company_id/threads/:thread_id/messages/:message_id/reaction",
    preValidation: [fastify.authenticate],
    handler: messagesController.reaction.bind(messagesController),
  });

  fastify.route({
    method: "POST",
    url: "/companies/:company_id/threads/:thread_id/messages/:message_id/bookmark",
    preValidation: [fastify.authenticate],
    handler: messagesController.bookmark.bind(messagesController),
  });

  fastify.route({
    method: "POST",
    url: "/companies/:company_id/threads/:thread_id/messages/:message_id/pin",
    preValidation: [fastify.authenticate],
    handler: messagesController.pin.bind(messagesController),
  });

  fastify.route({
    method: "POST",
    url: "/companies/:company_id/threads/:thread_id/messages/:message_id/delete",
    preValidation: [fastify.authenticate],
    handler: messagesController.delete.bind(messagesController),
  });

  /**
   * Views routes
   */
  fastify.route({
    method: "GET",
    url: "/companies/:company_id/workspaces/:workspace_id/channels/:channel_id/feed",
    preValidation: [fastify.authenticate],
    handler: viewsController.feed.bind(viewsController),
  });

  fastify.route({
    method: "GET",
    url: "/companies/:company_id/files",
    preValidation: [fastify.authenticate],
    handler: viewsController.files.bind(viewsController),
  });

  fastify.route({
    method: "GET",
    url: "/companies/:company_id/bookmarks",
    preValidation: [fastify.authenticate],
    handler: viewsController.bookmarks.bind(viewsController),
  });

  fastify.route({
    method: "GET",
    url: "/companies/:company_id/inbox",
    preValidation: [fastify.authenticate],
    handler: viewsController.inbox.bind(viewsController),
  });

  fastify.route({
    method: "GET",
    url: "/companies/:company_id/search",
    preValidation: [fastify.authenticate],
    handler: viewsController.search.bind(viewsController),
  });

  next();
};

export default routes;
