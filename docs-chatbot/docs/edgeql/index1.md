# Design goals

EdgeQL is a spiritual successor to SQL designed with a few core principles in mind.

**Compatible with modern languages**. A jaw-dropping amount of effort has been spent attempting to [bridge the gap](https://en.wikipedia.org/wiki/Object%E2%80%93relational_impedance_mismatch) between the _relational_ paradigm of SQL and the _object-oriented_ nature of modern programming languages. EdgeDB sidesteps this problem by modeling data in an _object-relational_ way.

**Strongly typed**. EdgeQL is _inextricably tied_ to EdgeDB’s rigorous object-oriented type system. The type of all expressions is statically inferred by EdgeDB.

**Designed for programmers**. EdgeQL prioritizes syntax over keywords; It uses `{ curly braces }` to define scopes/structures and the _assignment operator_`:=` to set values. The result is a query language that looks more like code and less like word soup.

**Easy deep querying**. EdgeDB’s object-relational nature makes it painless to write deep, performant queries that traverse links, no `JOINs` required.

**Composable**. [Unlike SQL](/blog/we-can-do-better-than-sql#lack-of-orthogonality), EdgeQL’s syntax is readily composable; queries can be cleanly nested without worrying about Cartesian explosion.

> Note: For a detailed writeup on the design of SQL, see [We Can Do Better Than SQL](/blog/we-can-do-better-than-sql#lack-of-orthogonality) on the EdgeDB blog.

[Learn more](https://www.edgedb.com/docs/edgeql/index)
