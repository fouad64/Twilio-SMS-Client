package DB_PK;


import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DB 
{
    private static String url;
    private static String user;
    private static String password;

    static {
        Properties props = new Properties();
        try (InputStream is = DB.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (is == null) {
                throw new RuntimeException("db.properties file not found in resources!");
            }
            props.load(is);
            url = props.getProperty("db.url");
            user = props.getProperty("db.username");
            password = props.getProperty("db.password");
        } catch (IOException e) {
            throw new RuntimeException("Failed to load db.properties", e);
        }
    }
    
    public static Connection getConnection() throws ClassNotFoundException 
    {
        try 
        {
            Class.forName("org.postgresql.Driver");

            Connection con =
                    DriverManager.getConnection(
                            url,
                            user,
                            password
                    );
            return con;
        } catch (SQLException e) 
        {
            throw new RuntimeException("Database connection failed", e);
        }
    }
}
