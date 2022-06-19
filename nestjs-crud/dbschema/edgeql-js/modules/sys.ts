import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _schema from "./schema";
import type * as _std from "./std";
enum $TransactionIsolationλEnum {
  RepeatableRead = "RepeatableRead",
  Serializable = "Serializable",
}
export type $TransactionIsolation = {
  RepeatableRead: $.$expr_Literal<$TransactionIsolation>;
  Serializable: $.$expr_Literal<$TransactionIsolation>;
} & $.EnumType<"sys::TransactionIsolation", `${$TransactionIsolationλEnum}`>;
const TransactionIsolation: $TransactionIsolation = $.makeType<$TransactionIsolation>(_.spec, "9734f19b-d556-11ec-af14-a5b642d3b3da", _.syntax.literal);

enum $VersionStageλEnum {
  dev = "dev",
  alpha = "alpha",
  beta = "beta",
  rc = "rc",
  final = "final",
}
export type $VersionStage = {
  dev: $.$expr_Literal<$VersionStage>;
  alpha: $.$expr_Literal<$VersionStage>;
  beta: $.$expr_Literal<$VersionStage>;
  rc: $.$expr_Literal<$VersionStage>;
  final: $.$expr_Literal<$VersionStage>;
} & $.EnumType<"sys::VersionStage", `${$VersionStageλEnum}`>;
const VersionStage: $VersionStage = $.makeType<$VersionStage>(_.spec, "9735bd5e-d556-11ec-8845-29687743757d", _.syntax.literal);

export type $SystemObjectλShape = $.typeutil.flatten<_schema.$AnnotationSubjectλShape & {
}>;
type $SystemObject = $.ObjectType<"sys::SystemObject", $SystemObjectλShape, null>;
const $SystemObject = $.makeType<$SystemObject>(_.spec, "9736778d-d556-11ec-a9a2-d7dbf7e925dc", _.syntax.literal);

const SystemObject: $.$expr_PathNode<$.TypeSet<$SystemObject, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($SystemObject, $.Cardinality.Many), null, true);

export type $DatabaseλShape = $.typeutil.flatten<$SystemObjectλShape & _schema.$AnnotationSubjectλShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
}>;
type $Database = $.ObjectType<"sys::Database", $DatabaseλShape, null>;
const $Database = $.makeType<$Database>(_.spec, "975de3a6-d556-11ec-8e4d-c3513e265aec", _.syntax.literal);

const Database: $.$expr_PathNode<$.TypeSet<$Database, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Database, $.Cardinality.Many), null, true);

export type $ExtensionPackageλShape = $.typeutil.flatten<$SystemObjectλShape & _schema.$AnnotationSubjectλShape & {
  "script": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "version": $.PropertyDesc<$.NamedTupleType<{major: _std.$int64, minor: _std.$int64, stage: $VersionStage, stage_no: _std.$int64, local: $.ArrayType<_std.$str>}>, $.Cardinality.One, false, false, false, false>;
  "<package[is schema::Extension]": $.LinkDesc<_schema.$Extension, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<package": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $ExtensionPackage = $.ObjectType<"sys::ExtensionPackage", $ExtensionPackageλShape, null>;
const $ExtensionPackage = $.makeType<$ExtensionPackage>(_.spec, "978a2713-d556-11ec-93db-b9c3935d1483", _.syntax.literal);

const ExtensionPackage: $.$expr_PathNode<$.TypeSet<$ExtensionPackage, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($ExtensionPackage, $.Cardinality.Many), null, true);

export type $RoleλShape = $.typeutil.flatten<$SystemObjectλShape & _schema.$InheritingObjectλShape & _schema.$AnnotationSubjectλShape & {
  "name": $.PropertyDesc<_std.$str, $.Cardinality.One, true, false, false, false>;
  "superuser": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, false, false, false>;
  "is_superuser": $.PropertyDesc<_std.$bool, $.Cardinality.One, false, true, false, false>;
  "password": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, false, false>;
  "member_of": $.LinkDesc<$Role, $.Cardinality.Many, {}, false, false,  false, false>;
  "<member_of[is sys::Role]": $.LinkDesc<$Role, $.Cardinality.Many, {}, false, false,  false, false>;
  "<member_of": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Role = $.ObjectType<"sys::Role", $RoleλShape, null>;
const $Role = $.makeType<$Role>(_.spec, "97bc2eea-d556-11ec-88ee-d392a83cc059", _.syntax.literal);

const Role: $.$expr_PathNode<$.TypeSet<$Role, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Role, $.Cardinality.Many), null, true);

type get_versionλFuncExpr = $.$expr_Function<
  "sys::get_version",
  [],
  {},
  $.TypeSet<$.NamedTupleType<{major: _std.$int64, minor: _std.$int64, stage: $VersionStage, stage_no: _std.$int64, local: $.ArrayType<_std.$str>}>, $.Cardinality.One>
>;
/**
 * Return the server version as a tuple.
 */
function get_version(): get_versionλFuncExpr;
function get_version(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('sys::get_version', args, _.spec, [
    {args: [], returnTypeId: "4f04e529-c585-fdcd-d4ee-ec50d5695ef6"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "sys::get_version",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};

type get_version_as_strλFuncExpr = $.$expr_Function<
  "sys::get_version_as_str",
  [],
  {},
  $.TypeSet<_std.$str, $.Cardinality.One>
>;
/**
 * Return the server version as a string.
 */
function get_version_as_str(): get_version_as_strλFuncExpr;
function get_version_as_str(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('sys::get_version_as_str', args, _.spec, [
    {args: [], returnTypeId: "00000000-0000-0000-0000-000000000101"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "sys::get_version_as_str",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};

type get_transaction_isolationλFuncExpr = $.$expr_Function<
  "sys::get_transaction_isolation",
  [],
  {},
  $.TypeSet<$TransactionIsolation, $.Cardinality.One>
>;
/**
 * Return the isolation level of the current transaction.
 */
function get_transaction_isolation(): get_transaction_isolationλFuncExpr;
function get_transaction_isolation(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('sys::get_transaction_isolation', args, _.spec, [
    {args: [], returnTypeId: "9734f19b-d556-11ec-af14-a5b642d3b3da"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "sys::get_transaction_isolation",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};

type get_current_databaseλFuncExpr = $.$expr_Function<
  "sys::get_current_database",
  [],
  {},
  $.TypeSet<_std.$str, $.Cardinality.One>
>;
/**
 * Return the name of the current database as a string.
 */
function get_current_database(): get_current_databaseλFuncExpr;
function get_current_database(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('sys::get_current_database', args, _.spec, [
    {args: [], returnTypeId: "00000000-0000-0000-0000-000000000101"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "sys::get_current_database",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};



export { $TransactionIsolationλEnum, TransactionIsolation, $VersionStageλEnum, VersionStage, $SystemObject, SystemObject, $Database, Database, $ExtensionPackage, ExtensionPackage, $Role, Role };

type __defaultExports = {
  "TransactionIsolation": typeof TransactionIsolation;
  "VersionStage": typeof VersionStage;
  "SystemObject": typeof SystemObject;
  "Database": typeof Database;
  "ExtensionPackage": typeof ExtensionPackage;
  "Role": typeof Role;
  "get_version": typeof get_version;
  "get_version_as_str": typeof get_version_as_str;
  "get_transaction_isolation": typeof get_transaction_isolation;
  "get_current_database": typeof get_current_database
};
const __defaultExports: __defaultExports = {
  "TransactionIsolation": TransactionIsolation,
  "VersionStage": VersionStage,
  "SystemObject": SystemObject,
  "Database": Database,
  "ExtensionPackage": ExtensionPackage,
  "Role": Role,
  "get_version": get_version,
  "get_version_as_str": get_version_as_str,
  "get_transaction_isolation": get_transaction_isolation,
  "get_current_database": get_current_database
};
export default __defaultExports;
