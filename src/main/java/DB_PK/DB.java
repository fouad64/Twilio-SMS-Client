package DB_PK;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DB 
{
    private static final String URL = "jdbc:postgresql://ep-steep-darkness-agtl36wb-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";

    private static final String USER = "neondb_owner";

    private static final String PASSWORD = "npg_XemnQviIcb41";
    
    public static Connection getConnection() throws ClassNotFoundException 
    {
        try 
        {
            Class.forName("org.postgresql.Driver");

            Connection con =
                    DriverManager.getConnection(
                            URL,
                            USER,
                            PASSWORD
                    );
            return con;
        } catch (SQLException e) 
        {
            throw new RuntimeException("Database connection failed", e);
        }
    }
}
