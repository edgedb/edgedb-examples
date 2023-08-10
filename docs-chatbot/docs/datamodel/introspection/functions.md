# Functions

This section describes introspection of [functions](https://edgedb.com/docs/datamodel/functions#ref-datamodel-functions).

Introspection of the `schema::Function`:

```edgeql-repl
db> with module schema
... select ObjectType {
...     name,
...     links: {
...         name,
...     },
...     properties: {
...         name,
...     }
... }
... filter .name = 'schema::Function';
{
    Object {
        name: 'schema::Function',
        links: {
            Object { name: '__type__' },
            Object { name: 'annotations' },
            Object { name: 'params' },
            Object { name: 'return_type' }
        },
        properties: {
            Object { name: 'id' },
            Object { name: 'name' },
            Object { name: 'return_typemod' }
        }
    }
}
```

Since `params` are quite important to functions, here’s their structure:

```edgeql-repl
db> with module schema
... select ObjectType {
...     name,
...     links: {
...         name,
...     },
...     properties: {
...         name,
...     }
... }
... filter .name = 'schema::Parameter';
{
    Object {
        name: 'schema::Parameter',
        links: {
            Object { name: '__type__' },
            Object { name: 'type' }
        },
        properties: {
            Object { name: 'default' },
            Object { name: 'id' },
            Object { name: 'kind' },
            Object { name: 'name' },
            Object { name: 'num' },
            Object { name: 'typemod' }
        }
    }
}
```

Introspection of the built-in [`count()`](https://edgedb.com/docs/stdlib/set#function::std::count):

```edgeql-repl
db> with module schema
... select `Function` {
...     name,
...     annotations: { name, @value },
...     params: {
...         kind,
...         name,
...         num,
...         typemod,
...         type: { name },
...         default,
...     },
...     return_typemod,
...     return_type: { name },
... }
... filter .name = 'std::count';
{
    Object {
        name: 'std::count',
        annotations: {},
        params: {
            Object {
                kind: 'PositionalParam',
                name: 's',
                num: 0,
                typemod: 'SetOfType',
                type: Object { name: 'anytype' },
                default: {}
            }
        },
        return_typemod: 'SingletonType',
        return_type: Object { name: 'std::int64' }
    }
}
```

|                                                                                                              |
| ------------------------------------------------------------------------------------------------------------ |
| **See also**                                                                                                 |
| [Schema > Functions](https://edgedb.com/docs/datamodel/functions#ref-datamodel-functions)                    |
| [SDL > Functions](https://edgedb.com/docs/reference/sdl/functions#ref-eql-sdl-functions)                     |
| [DDL > Functions](https://edgedb.com/docs/reference/ddl/functions#ref-eql-ddl-functions)                     |
| [Reference > Function calls](https://edgedb.com/docs/reference/edgeql/functions#ref-reference-function-call) |
| [Cheatsheets > Functions](https://edgedb.com/docs/guides/cheatsheet/functions#ref-cheatsheet-functions)      |

[Learn more](https://www.edgedb.com/docs/datamodel/introspection/functions)
