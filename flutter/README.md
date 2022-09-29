# Flutter + EdgeDB example

An example Flutter project using EdgeDB.

## Getting Started

This project is the default starting point for a Flutter application
as created by `flutter create`, with a few changes to demonstrate how to
get started with using EdgeDB.

To try out this example:

1. First run `edgedb project init`, follow the prompts to
   create a new development database instance.

2. Run `flutter pub run build_runner build` to generate typed query methods
   for the `.edgeql` query files.

3. Finally, run `flutter run`.

> **Note**: Currently there are a few caveats that come
> with using `edgedb` on the client side (as opposed to on the server):
>
> - You will need to explicitly provide connection details to
>   `createClient()`. Normally it relies relies on the app being run from your
>   project directory (or with enviroment variables in production) which won't
>   be available in the compiled client app.
> - You'll also likely want to limit the data a user of the app can
>   access. For this we recommend using
>   [access policies](https://www.edgedb.com/docs/datamodel/access_policies).

For more details on EdgeDB or the Dart `edgedb` package, check out our docs:
<https://www.edgedb.com/docs>.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
