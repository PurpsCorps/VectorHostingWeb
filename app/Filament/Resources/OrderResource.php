<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\Action;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('order_id')
                    ->required()
                    ->maxLength(50)
                    ->default('Vector-'),
                Forms\Components\TextInput::make('items')
                    ->maxLength(50),
                Forms\Components\TextInput::make('payment_method')
                    ->maxLength(50),
                Forms\Components\TextInput::make('subtotal')
                    ->numeric(),
                Forms\Components\TextInput::make('total')
                    ->numeric(),
                Forms\Components\TextInput::make('status')
                    ->maxLength(50),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_id')
                    ->label('Order ID')
                    ->searchable(),
                Tables\Columns\TextColumn::make('payment_method')
                    ->label('Payment')
                    ->getStateUsing(function (Order $record): string {
                        $items = $record->payment_method;
                        return strtoupper($items);
                    })
                    ->searchable(),
                Tables\Columns\TextColumn::make('subtotal')
                    ->numeric(
                        thousandsSeparator: '.'
                    )
                    ->prefix('Rp ')
                    ->sortable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->getStateUsing(function (Order $record): string {
                        $items = $record->status;

                        if($items === "waiting_payment_confirm") {
                            $items = "Waiting for Payment";
                        } else if($items === "payment_confirmed") {
                            $items = "Payment Confirmed";
                        } else if($items === "on_process") {
                            $items = "On Process";
                        } else if($items === "completed") {
                            $items = "Completed";
                        } else if($items === "canceled") {
                            $items = "Canceled";
                        }

                        return $items;
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'Waiting for Payment' => 'danger',
                        'Payment Confirmed' => 'info',
                        'On Process' => 'warning',
                        'Completed' => 'success',
                        'Canceled' => 'danger',
                    })
                    ->searchable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Action::make('Payment Proof')
                    ->url(fn (Order $record): string => env('APP_URL').'/storage/payment_proofs/'.$record->payment_proof)
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->hidden(fn (Order $record): bool => $record->status !== "waiting_payment_confirm")
                    ->openUrlInNewTab(),
                Action::make('Confirm Payment')
                    ->button()
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->action(function (Order $record) {
                        $record->update(['status' => 'payment_confirmed']);
                    })
                    ->requiresConfirmation()
                    ->hidden(fn (Order $record): bool => $record->status !== "waiting_payment_confirm")
                    ->successNotificationTitle('Order marked as Payment Confirmed'),
                Action::make('process')
                    ->button()
                    ->label('Process')
                    ->icon('heroicon-o-arrow-path')
                    ->color('warning')
                    ->action(function (Order $record) {
                        $record->update(['status' => 'on_process']);
                    })
                    ->requiresConfirmation()
                    ->hidden(fn (Order $record): bool => $record->status === 'on_process' || $record->status === 'completed' || $record->status === 'canceled' || $record->status === "waiting_payment_confirm")
                    ->successNotificationTitle('Order marked as On Process'),
                Action::make('complete')
                    ->button()
                    ->label('Complete')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->action(function (Order $record) {
                        $record->update(['status' => 'completed']);
                    })
                    ->requiresConfirmation()
                    ->hidden(fn (Order $record): bool => $record->status === 'completed' || $record->status === 'canceled' || $record->status === "waiting_payment_confirm")
                    ->successNotificationTitle('Order marked as Completed'),
                Action::make('cancel')
                    ->button()
                    ->label('Cancel')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->action(function (Order $record) {
                        $record->update(['status' => 'canceled']);
                    })
                    ->requiresConfirmation()
                    ->hidden(fn (Order $record): bool => $record->status === 'canceled' || $record->status === 'completed')
                    ->successNotificationTitle('Order marked as Canceled'),
                Tables\Actions\EditAction::make()
                ->hidden(fn (Order $record): bool => $record->status === "waiting_payment_confirm"),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
