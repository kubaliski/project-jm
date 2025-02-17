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

        <!-- Preload de chunks críticos -->
        @production
            @php
                $manifestPath = public_path('build/manifest.json');
                if (file_exists($manifestPath)) {
                    $manifest = json_decode(file_get_contents($manifestPath), true);
                    $criticalChunks = [
                        'react-core',
                        'react-router-redux',
                        'critical-home'
                    ];

                    $preloadFiles = collect($manifest ?? [])
                        ->filter(function($entry, $key) use ($criticalChunks) {
                            return collect($criticalChunks)->contains(function($chunk) use ($key) {
                                return str_contains($key, $chunk);
                            });
                        })
                        ->pluck('file');
                }
            @endphp

            @isset($preloadFiles)
                @foreach($preloadFiles as $file)
                    @if(str_ends_with($file, '.js'))
                        <link rel="modulepreload" href="/build/{{ $file }}" as="script" crossorigin>
                    @elseif(str_ends_with($file, '.css'))
                        <link rel="preload" href="/build/{{ $file }}" as="style">
                    @endif
                @endforeach
            @endisset
        @endproduction

        <!-- Estilos críticos inline -->
        <style>
            .hero-gradient {
                background: linear-gradient(to right, #2563eb, #7c3aed);
            }
            .hero-transition {
                transition: opacity 500ms ease-in-out, transform 500ms ease-in-out;
            }
        </style>

        <!-- Scripts y configuración -->
        <script>
            window.APP_NAME = "{{ config('app.name') }}";
            window.config = {
                appName: "{{ config('app.name') }}",
            };
        </script>

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    </head>
    <body class="antialiased">
        <noscript>
            <div style="padding: 20px; text-align: center; background-color: #fef2f2; color: #991b1b;">
                Para una mejor experiencia, por favor habilite JavaScript en su navegador.
            </div>
        </noscript>

        <div id="app"></div>
    </body>
</html>