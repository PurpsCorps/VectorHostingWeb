<?php

namespace App\Filament\Resources;

use Closure;
use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use App\Models\ProductCategory;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?int $navigationSort = 1;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-check';

    protected static ?string $navigationGroup = 'Product Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->maxLength(50),
                Forms\Components\TextInput::make('label')
                    ->maxLength(50),
                Forms\Components\FileUpload::make('image')
                    ->image(),
                Forms\Components\TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->default(0)
                    ->prefix('Rp'),
                Forms\Components\TextInput::make('spek'),
                Forms\Components\TextInput::make('stok')
                    ->required()
                    ->numeric()
                    ->default(0),
                Forms\Components\Select::make('category')
                    ->label('Category')
                    ->options(ProductCategory::all()->pluck('label', 'name'))
                    ->searchable(),
                Forms\Components\TextInput::make('recommended')
                    ->numeric()
                    ->default(0),
                Forms\Components\TextInput::make('show')
                    ->numeric()
                    ->default(0),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image'),
                Tables\Columns\TextColumn::make('name')
                    ->searchable(),
                Tables\Columns\TextColumn::make('label')
                    ->searchable(),
                Tables\Columns\TextColumn::make('price')
                    ->numeric(
                        thousandsSeparator: '.'
                    )
                    ->prefix('Rp ')
                    ->sortable(),
                Tables\Columns\TextColumn::make('stok')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category')
                    ->searchable(),
                Tables\Columns\BooleanColumn::make('recommended')
                    ->sortable(),
                Tables\Columns\BooleanColumn::make('show')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
