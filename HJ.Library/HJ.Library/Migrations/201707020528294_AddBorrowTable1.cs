namespace HJ.Library.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddBorrowTable1 : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.Borrows", name: "User_Id", newName: "UserId");
            RenameIndex(table: "dbo.Borrows", name: "IX_User_Id", newName: "IX_UserId");
            DropColumn("dbo.Borrows", "UserName");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Borrows", "UserName", c => c.String());
            RenameIndex(table: "dbo.Borrows", name: "IX_UserId", newName: "IX_User_Id");
            RenameColumn(table: "dbo.Borrows", name: "UserId", newName: "User_Id");
        }
    }
}
