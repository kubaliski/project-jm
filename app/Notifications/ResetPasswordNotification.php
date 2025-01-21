<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;

class ResetPasswordNotification extends Notification
{
    public function __construct(public readonly string $token)
    {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        // Construimos la URL directamente para nuestra SPA
        $url = url("/reset-password?token={$this->token}&email={$notifiable->getEmailForPasswordReset()}");

        return (new MailMessage)
            ->subject('Recuperación de Contraseña')
            ->greeting('¡Hola!')
            ->line('Estás recibiendo este email porque hemos recibido una solicitud de recuperación de contraseña para tu cuenta.')
            ->action('Recuperar Contraseña', $url)
            ->line('Este enlace de recuperación caducará en :count minutos.', ['count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire')])
            ->line('Si no has solicitado un cambio de contraseña, puedes ignorar este mensaje.');
    }
}