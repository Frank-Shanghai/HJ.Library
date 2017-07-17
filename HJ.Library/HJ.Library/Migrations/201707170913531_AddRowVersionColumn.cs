namespace HJ.Library.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddRowVersionColumn : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Books", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
            AddColumn("dbo.Borrows", "RowVersion", c => c.Binary(nullable: false, fixedLength: true, timestamp: true, storeType: "rowversion"));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Borrows", "RowVersion");
            DropColumn("dbo.Books", "RowVersion");
        }
    }
}
