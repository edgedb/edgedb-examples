import { $ } from "edgedb";
import * as _ from "../imports";
import type * as _std from "./std";
enum $AllowBareDDLλEnum {
  AlwaysAllow = "AlwaysAllow",
  NeverAllow = "NeverAllow",
}
export type $AllowBareDDL = {
  AlwaysAllow: $.$expr_Literal<$AllowBareDDL>;
  NeverAllow: $.$expr_Literal<$AllowBareDDL>;
} & $.EnumType<"cfg::AllowBareDDL", `${$AllowBareDDLλEnum}`>;
const AllowBareDDL: $AllowBareDDL = $.makeType<$AllowBareDDL>(_.spec, "98c38536-d556-11ec-95c1-8b0eb5c35864", _.syntax.literal);

export type $memory = $.ScalarType<"cfg::memory", _.edgedb.ConfigMemory, true>;
const memory: $.scalarTypeWithConstructor<$memory, never> = $.makeType<$.scalarTypeWithConstructor<$memory, never>>(_.spec, "00000000-0000-0000-0000-000000000130", _.syntax.literal);

export type $ConfigObjectλShape = $.typeutil.flatten<_std.$BaseObjectλShape & {
}>;
type $ConfigObject = $.ObjectType<"cfg::ConfigObject", $ConfigObjectλShape, null>;
const $ConfigObject = $.makeType<$ConfigObject>(_.spec, "9826eeca-d556-11ec-bf68-1b6406c71001", _.syntax.literal);

const ConfigObject: $.$expr_PathNode<$.TypeSet<$ConfigObject, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($ConfigObject, $.Cardinality.Many), null, true);

export type $AbstractConfigλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "session_idle_timeout": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, true>;
  "session_idle_transaction_timeout": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, true>;
  "query_execution_timeout": $.PropertyDesc<_std.$duration, $.Cardinality.One, false, false, false, false>;
  "listen_port": $.PropertyDesc<_std.$int16, $.Cardinality.One, false, false, false, true>;
  "listen_addresses": $.PropertyDesc<_std.$str, $.Cardinality.Many, false, false, false, false>;
  "auth": $.LinkDesc<$Auth, $.Cardinality.Many, {}, false, false,  false, false>;
  "allow_dml_in_functions": $.PropertyDesc<_std.$bool, $.Cardinality.AtMostOne, false, false, false, true>;
  "allow_bare_ddl": $.PropertyDesc<$AllowBareDDL, $.Cardinality.AtMostOne, false, false, false, true>;
  "shared_buffers": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
  "query_work_mem": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
  "effective_cache_size": $.PropertyDesc<$memory, $.Cardinality.AtMostOne, false, false, false, false>;
  "effective_io_concurrency": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
  "default_statistics_target": $.PropertyDesc<_std.$int64, $.Cardinality.AtMostOne, false, false, false, false>;
}>;
type $AbstractConfig = $.ObjectType<"cfg::AbstractConfig", $AbstractConfigλShape, null>;
const $AbstractConfig = $.makeType<$AbstractConfig>(_.spec, "98e63c22-d556-11ec-8990-b54fa361c828", _.syntax.literal);

const AbstractConfig: $.$expr_PathNode<$.TypeSet<$AbstractConfig, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($AbstractConfig, $.Cardinality.Many), null, true);

export type $AuthλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "priority": $.PropertyDesc<_std.$int64, $.Cardinality.One, true, false, true, false>;
  "user": $.PropertyDesc<_std.$str, $.Cardinality.Many, false, false, true, true>;
  "method": $.LinkDesc<$AuthMethod, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "comment": $.PropertyDesc<_std.$str, $.Cardinality.AtMostOne, false, false, true, false>;
  "<auth[is cfg::AbstractConfig]": $.LinkDesc<$AbstractConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::Config]": $.LinkDesc<$Config, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::InstanceConfig]": $.LinkDesc<$InstanceConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth[is cfg::DatabaseConfig]": $.LinkDesc<$DatabaseConfig, $.Cardinality.Many, {}, false, false,  false, false>;
  "<auth": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Auth = $.ObjectType<"cfg::Auth", $AuthλShape, null>;
const $Auth = $.makeType<$Auth>(_.spec, "98c50350-d556-11ec-b11b-3bae56ff69f7", _.syntax.literal);

const Auth: $.$expr_PathNode<$.TypeSet<$Auth, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Auth, $.Cardinality.Many), null, true);

export type $AuthMethodλShape = $.typeutil.flatten<$ConfigObjectλShape & {
  "<method[is cfg::Auth]": $.LinkDesc<$Auth, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<method": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $AuthMethod = $.ObjectType<"cfg::AuthMethod", $AuthMethodλShape, null>;
const $AuthMethod = $.makeType<$AuthMethod>(_.spec, "983604e7-d556-11ec-b351-2fd1cd651746", _.syntax.literal);

const AuthMethod: $.$expr_PathNode<$.TypeSet<$AuthMethod, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($AuthMethod, $.Cardinality.Many), null, true);

export type $ConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {
}>;
type $Config = $.ObjectType<"cfg::Config", $ConfigλShape, null>;
const $Config = $.makeType<$Config>(_.spec, "991b44be-d556-11ec-9ecb-cdb05513c16c", _.syntax.literal);

const Config: $.$expr_PathNode<$.TypeSet<$Config, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Config, $.Cardinality.Many), null, true);

export type $DatabaseConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {
}>;
type $DatabaseConfig = $.ObjectType<"cfg::DatabaseConfig", $DatabaseConfigλShape, null>;
const $DatabaseConfig = $.makeType<$DatabaseConfig>(_.spec, "998a1c9e-d556-11ec-be34-433c8c4a659d", _.syntax.literal);

const DatabaseConfig: $.$expr_PathNode<$.TypeSet<$DatabaseConfig, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($DatabaseConfig, $.Cardinality.Many), null, true);

export type $InstanceConfigλShape = $.typeutil.flatten<$AbstractConfigλShape & {
}>;
type $InstanceConfig = $.ObjectType<"cfg::InstanceConfig", $InstanceConfigλShape, null>;
const $InstanceConfig = $.makeType<$InstanceConfig>(_.spec, "9952bb96-d556-11ec-8f8e-9524e224c00b", _.syntax.literal);

const InstanceConfig: $.$expr_PathNode<$.TypeSet<$InstanceConfig, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($InstanceConfig, $.Cardinality.Many), null, true);

export type $SCRAMλShape = $.typeutil.flatten<$AuthMethodλShape & {
}>;
type $SCRAM = $.ObjectType<"cfg::SCRAM", $SCRAMλShape, null>;
const $SCRAM = $.makeType<$SCRAM>(_.spec, "98540bad-d556-11ec-9c74-5b8fa83d5afa", _.syntax.literal);

const SCRAM: $.$expr_PathNode<$.TypeSet<$SCRAM, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($SCRAM, $.Cardinality.Many), null, true);

export type $TrustλShape = $.typeutil.flatten<$AuthMethodλShape & {
}>;
type $Trust = $.ObjectType<"cfg::Trust", $TrustλShape, null>;
const $Trust = $.makeType<$Trust>(_.spec, "9844f07d-d556-11ec-9cbb-636f3da4842a", _.syntax.literal);

const Trust: $.$expr_PathNode<$.TypeSet<$Trust, $.Cardinality.Many>, null, true> = _.syntax.$PathNode($.$toSet($Trust, $.Cardinality.Many), null, true);

type get_config_jsonλFuncExpr<
  NamedArgs extends {
    "sources"?: $.TypeSet<$.ArrayType<_std.$str>>,
    "max_source"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  },
> = $.$expr_Function<
  "cfg::get_config_json",
  [],
  _.castMaps.mapLiteralToTypeSet<NamedArgs>,
  $.TypeSet<_std.$json, $.cardinalityUtil.multiplyCardinalities<$.cardinalityUtil.optionalParamCardinality<NamedArgs["sources"]>, $.cardinalityUtil.optionalParamCardinality<_.castMaps.literalToTypeSet<NamedArgs["max_source"]>>>>
>;
function get_config_json<
  NamedArgs extends {
    "sources"?: $.TypeSet<$.ArrayType<_std.$str>>,
    "max_source"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
  },
>(
  namedArgs: NamedArgs,
): get_config_jsonλFuncExpr<NamedArgs>;
function get_config_json(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('cfg::get_config_json', args, _.spec, [
    {args: [], namedArgs: {"sources": {typeId: "05f91774-15ea-9001-038e-092c1cad80af", optional: true, setoftype: false, variadic: false}, "max_source": {typeId: "00000000-0000-0000-0000-000000000101", optional: true, setoftype: false, variadic: false}}, returnTypeId: "00000000-0000-0000-0000-00000000010f"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "cfg::get_config_json",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};



export { $AllowBareDDLλEnum, AllowBareDDL, memory, $ConfigObject, ConfigObject, $AbstractConfig, AbstractConfig, $Auth, Auth, $AuthMethod, AuthMethod, $Config, Config, $DatabaseConfig, DatabaseConfig, $InstanceConfig, InstanceConfig, $SCRAM, SCRAM, $Trust, Trust };

type __defaultExports = {
  "AllowBareDDL": typeof AllowBareDDL;
  "memory": typeof memory;
  "ConfigObject": typeof ConfigObject;
  "AbstractConfig": typeof AbstractConfig;
  "Auth": typeof Auth;
  "AuthMethod": typeof AuthMethod;
  "Config": typeof Config;
  "DatabaseConfig": typeof DatabaseConfig;
  "InstanceConfig": typeof InstanceConfig;
  "SCRAM": typeof SCRAM;
  "Trust": typeof Trust;
  "get_config_json": typeof get_config_json
};
const __defaultExports: __defaultExports = {
  "AllowBareDDL": AllowBareDDL,
  "memory": memory,
  "ConfigObject": ConfigObject,
  "AbstractConfig": AbstractConfig,
  "Auth": Auth,
  "AuthMethod": AuthMethod,
  "Config": Config,
  "DatabaseConfig": DatabaseConfig,
  "InstanceConfig": InstanceConfig,
  "SCRAM": SCRAM,
  "Trust": Trust,
  "get_config_json": get_config_json
};
export default __defaultExports;
