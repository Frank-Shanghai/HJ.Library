namespace HJ.Library.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateBook : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Books", "Status");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Books", "Status", c => c.Int(nullable: false));
        }
    }
}
