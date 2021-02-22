import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Event, EventModel } from "../entities/Event";
import { User } from "../entities/User";
import { EventInput } from "./types/Event.inputs";

@Resolver((_of) => Event)
export class EventResolvers {
  @Authorized()
  @Query((_returns) => [Event])
  async getUserEvents(@Ctx("user") user: Partial<User>) {
    try {
      const events = await EventModel.find({ userId: user._id });

      return events;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Authorized()
  @Mutation((_returns) => Event)
  async createEvent(
    @Arg("eventInput") eventInput: EventInput,
    @Ctx("user") user: Partial<User>
  ) {
    const newEvent = new EventModel({
      ...eventInput,
      userId: user._id,
      createdAt: new Date(),
    });
    try {
      return await newEvent.save();
    } catch (error) {
      throw new Error(error);
    }
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
        userId: user._id,
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
}
