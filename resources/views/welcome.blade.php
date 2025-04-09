<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="VectorHosting – Layanan hosting berkualitas dengan kecepatan tinggi dan harga terjangkau. Accelerate with Precision untuk performa terbaik website Anda." />
    <meta name="keywords" content="vector, vector hosting, hosting murah, hosting cepat, cloud hosting, web hosting, server terbaik, hosting berkualitas, VPS murah, domain, VectorHosting" />
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <title>Vector Hosting – Layanan hosting berkualitas dengan kecepatan tinggi dan harga terjangkau. Accelerate with Precision untuk performa terbaik website Anda.</title>
    @viteReactRefresh
    @vite('resources/css/app.css')
    @vite('resources/js/app.jsx')
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y6HFP4Q17S"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-Y6HFP4Q17S');
    </script>
</head>
<body class="antialiased">
    <div id="root"></div>
</body>
</html>