<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <title>Vector Hosting</title>
    <script src="https://cdn.jsdelivr.net/npm/react-scan/dist/auto.global.js"></script>
    @viteReactRefresh
    @vite('resources/css/app.css')
    @vite('resources/js/app.jsx ')
</head>
<body class="antialiased">
    <div id="root"></div>
</body>
</html>