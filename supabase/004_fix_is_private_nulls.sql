-- Normaliser is_private for eksisterende rader (kjør hvis reiser ikke vises)
update trips set is_private = false where is_private is null;
