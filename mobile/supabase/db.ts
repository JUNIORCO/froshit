import { _Event } from './db/event';
import { _Team } from './db/team';
import { _Resource } from "./db/resource";
import { _Offer } from "./db/offer";
import { _Message } from "./db/message";
import { _Profile } from "./db/profile";

export class db {
  public static event = _Event;
  public static team = _Team;
  public static resource = _Resource;
  public static offer = _Offer;
  public static message = _Message;
  public static profile = _Profile;
}

