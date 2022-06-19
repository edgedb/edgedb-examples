import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
export type $AuditableλShape = $.typeutil.flatten<_std.$Object_906a01bad55611ec888b072cfc45e0d2λShape & {
  "created_at": $.PropertyDesc<_std.$datetime, $.Cardinality.AtMostOne, false, false, true, true>;
}>;
type $Auditable = $.ObjectType<"default::Auditable", $AuditableλShape, null>;
const $Auditable = $.makeType<$Auditable>(_.spec, "4a7164f6-ea99-11ec-aca3-a57c9dc3c609", _.syntax.literal);

const Auditable: $.$expr_PathNode<$.TypeSet<$Auditable, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Auditable, $.Cardinality.Many), null, true);

export type $ActorλShape = $.typeutil.flatten<$AuditableλShape & {
  "age": $.PropertyDesc<_std.$int16, $.Cardinality.AtMostOne, false, false, false, false>;
  "is_deceased": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "height": $.PropertyDesc<_std.$int16, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $Actor = $.ObjectType<"default::Actor", $ActorλShape, null>;
const $Actor = $.makeType<$Actor>(_.spec, "4a736cc4-ea99-11ec-be09-9bf9a0ca7a22", _.syntax.literal);

const Actor: $.$expr_PathNode<$.TypeSet<$Actor, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Actor, $.Cardinality.Many), null, true);



export { $Auditable, Auditable, $Actor, Actor };

type __defaultExports = {
  "Auditable": typeof Auditable;
  "Actor": typeof Actor
};
const __defaultExports: __defaultExports = {
  "Auditable": Auditable,
  "Actor": Actor
};
export default __defaultExports;
