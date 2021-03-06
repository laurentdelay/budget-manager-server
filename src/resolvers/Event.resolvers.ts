import { DocumentType } from "@typegoose/typegoose";
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { CategoryModel } from "../entities/Category";
import { Event, EventModel } from "../entities/Event";
import { User } from "../entities/User";
import { EventInput } from "./types/Event.inputs";

@Resolver((_of) => Event)
export class EventResolvers {
  @Authorized()
  @Query((_returns) => [Event])
  async getUserEvents(@Ctx("user") user: Partial<User>) {
    const events = await EventModel.find({ userId: user.id });

    return events;
  }

  @Authorized()
  @Mutation((_returns) => Event)
  async createEvent(
    @Arg("eventInput") eventInput: EventInput,
    @Ctx("user") user: Partial<User>
  ) {
    const newEvent = new EventModel({
      ...eventInput,
      userId: user.id,
      createdAt: new Date(),
    });
    return await newEvent.save();
  }

  @Authorized()
  @Mutation((_result) => String)
  async removeEvent(
    @Arg("eventId") eventId: string,
    @Ctx("user") user: Partial<User>
  ) {
    try {
      const result = await EventModel.deleteOne({
        _id: eventId,
        userId: user.id,
      });

      if (result.ok == undefined) {
        throw new Error("Une erreur est survenue.");
      }

      if (result.deletedCount === 0) {
        throw new Error(
          "Erreur lors de la suppression: opération introuvable."
        );
      }

      return "Delete success";
    } catch (error) {
      throw new Error(error);
    }
  }

  @FieldResolver()
  async category(@Root() event: DocumentType<Event>) {
    const retrievedCategory = await CategoryModel.findById(event.categoryId);
    return retrievedCategory;
  }
}
