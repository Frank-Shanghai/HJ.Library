namespace HJ.Library.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UpdateBorrowEntity : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Borrows", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.Borrows", new[] { "UserId" });
            AlterColumn("dbo.Borrows", "UserId", c => c.String(nullable: false, maxLength: 128));
            CreateIndex("dbo.Borrows", "UserId");
            AddForeignKey("dbo.Borrows", "UserId", "dbo.AspNetUsers", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Borrows", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.Borrows", new[] { "UserId" });
            AlterColumn("dbo.Borrows", "UserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Borrows", "UserId");
            AddForeignKey("dbo.Borrows", "UserId", "dbo.AspNetUsers", "Id");
        }
    }
}
