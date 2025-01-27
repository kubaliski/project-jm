<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="{{ config('app.name') }} - Plataforma digital para servicios web y marketing">
        <meta name="theme-color" content="#3B82F6">
        <title>{{ config('app.name') }} | Página Principal</title>

        <!-- Meta tags para SEO y accesibilidad -->
        <meta name="format-detection" content="telephone=yes">
        <meta name="application-name" content="{{ config('app.name') }}">
        <link rel="canonical" href="{{ url()->current() }}">

        <!-- Scripts y configuración -->
        <script>
            // Configuración global
            window.APP_NAME = "{{ config('app.name') }}";
            window.config = {
                appName: "{{ config('app.name') }}",
            };
        </script>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body class="antialiased">
        <!-- Noscript mensaje -->
        <noscript>
            <div style="padding: 20px; text-align: center; background-color: #fef2f2; color: #991b1b;">
                Para una mejor experiencia, por favor habilite JavaScript en su navegador.
            </div>
        </noscript>

        <!-- Root div para React -->
        <div id="app"></div>
    </body>
</html>