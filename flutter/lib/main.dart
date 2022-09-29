import 'dart:math';

import 'package:edgedb/edgedb.dart';
import 'package:flutter/material.dart';

import './getNRandomMovies.edgeql.dart';

// Note: While running your app in development mode, 'createClient()' will
// automatically connect to your development database instance.
// However, when it comes time to build and release your app, you'll need to
// explicitly provide connection details to 'createClient()'.
final client = createClient(
  concurrency: 1,
);

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter + EdgeDB Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Flutter + EdgeDB Demo'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _movieCount = 5;
  String _movies = '';

  void _incrementCount() {
    setState(() {
      _movieCount++;
    });
  }

  void _decrementCount() {
    setState(() {
      _movieCount = max(1, _movieCount - 1);
    });
  }

  void _fetchMessage() async {
    final movies = await client.getNRandomMovies(n: _movieCount);
    setState(() => _movies = movies.map((movie) => movie.title).join('\n'));
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: Center(
        // Center is a layout widget. It takes a single child and positions it
        // in the middle of the parent.
        child: Column(
          // Column is also a layout widget. It takes a list of children and
          // arranges them vertically. By default, it sizes itself to fit its
          // children horizontally, and tries to be as tall as its parent.
          //
          // Invoke "debug painting" (press "p" in the console, choose the
          // "Toggle Debug Paint" action from the Flutter Inspector in Android
          // Studio, or the "Toggle Debug Paint" command in Visual Studio Code)
          // to see the wireframe for each widget.
          //
          // Column has various properties to control how it sizes itself and
          // how it positions its children. Here we use mainAxisAlignment to
          // center the children vertically; the main axis here is the vertical
          // axis because Columns are vertical (the cross axis would be
          // horizontal).
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                  onPressed: _decrementCount,
                  child: const Text(
                    '-',
                    style: TextStyle(fontSize: 24),
                  ),
                ),
                Text(
                  _movieCount.toString(),
                  style: const TextStyle(fontSize: 24),
                ),
                TextButton(
                  onPressed: _incrementCount,
                  child: const Text(
                    '+',
                    style: TextStyle(fontSize: 24),
                  ),
                ),
              ],
            ),
            const SizedBox(
              height: 24,
            ),
            Text(
              _movies,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 28),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _fetchMessage,
        label: const Text('Get Random Movies'),
        icon: const Icon(Icons.arrow_forward_rounded),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
