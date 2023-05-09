module DbConfig

open Microsoft.Extensions.DependencyInjection
open FluentMigrator.Runner

let criarServiceProvider () =
    ServiceCollection()
        .AddFluentMigratorCore()
        .ConfigureRunner(fun rb ->
            rb
                .AddSQLite()
                .WithGlobalConnectionString("Data Source=paleta.db")
                .ScanIn(typedefof<Migrations.AdicionarPaleta>.Assembly)
                .For.Migrations()
            |> ignore)
        .BuildServiceProvider(false)

let efetuarMigrations () =
    use serviceProvider = criarServiceProvider ()
    use scope = serviceProvider.CreateScope()

    let runner = scope.ServiceProvider.GetRequiredService<IMigrationRunner>()

    runner.MigrateUp()