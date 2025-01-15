<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-radius: 5px;
            }
            .content {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                margin-top: 20px;
                border: 1px solid #e9ecef;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                color: #6c757d;
            }
            .field {
                margin-bottom: 15px;
            }
            .field-label {
                font-weight: bold;
                color: #495057;
            }
            .field-value {
                margin-top: 5px;
            }
            .message-box {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin-top: 10px;
            }
            .timestamp {
                font-size: 12px;
                color: #6c757d;
                text-align: right;
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h2>Nuevo Mensaje de Contacto</h2>
        </div>

        <div class="content">
            <div class="field">
                <div class="field-label">Nombre:</div>
                <div class="field-value">{{ $contact->full_name }}</div>
            </div>

            <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value">{{ $contact->email }}</div>
            </div>

            @if($contact->phone)
            <div class="field">
                <div class="field-label">Teléfono:</div>
                <div class="field-value">{{ $contact->phone }}</div>
            </div>
            @endif

            <div class="field">
                <div class="field-label">Asunto:</div>
                <div class="field-value">{{ $contact->subject }}</div>
            </div>

            <div class="field">
                <div class="field-label">Mensaje:</div>
                <div class="message-box">
                    {{ $contact->message }}
                </div>
            </div>

            <div class="timestamp">
                Recibido el: {{ $contact->created_at->format('d/m/Y H:i') }}
            </div>
        </div>

        <div class="footer">
            <p>Este es un mensaje automático del sistema de contacto.</p>
            <p>© {{ date('Y') }} {{ config('app.name') }}</p>
        </div>
    </body>
</html>