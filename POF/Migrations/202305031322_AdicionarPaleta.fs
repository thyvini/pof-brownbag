namespace Migrations

open FluentMigrator

[<Migration(202305031322L)>]
type AdicionarPaleta() =
    inherit Migration()

    override this.Up () =
        this.Create.Table("Paletas")
            .WithColumn("Id").AsInt32().NotNullable().PrimaryKey().Identity()
            .WithColumn("Nome").AsString().NotNullable().Unique()
        |> ignore

        this.Create.Table("CoresPaletas")
            .WithColumn("Id").AsInt32().NotNullable().PrimaryKey().Identity()
            .WithColumn("Nome").AsString().NotNullable()
            .WithColumn("Cor").AsString(7).NotNullable()
            .WithColumn("IdPaleta").AsInt32().NotNullable()
        |> ignore

        this.Create.ForeignKey()
            .FromTable("CoresPaletas").ForeignColumn("IdPaleta")
            .ToTable("Paletas").PrimaryColumn("Id")
        |> ignore

    override this.Down () =
        this.Delete.Table("CoresPaletas") |> ignore
        this.Delete.Table("Paletas") |> ignore
