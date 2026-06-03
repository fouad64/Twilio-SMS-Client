
package USERS_PK;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Date;

public class User 
{
    private int userId;
    private String username;
    private String passwordHash;
    private int role;
    private boolean isVerified;
    private boolean isActive;
    private Date createdAt;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public int getRole() {
        return role;
    }

    public void setRole(int role) {
        this.role = role;
    }

    public boolean isIsVerified() {
        return isVerified;
    }

    public void setIsVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    public boolean isIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public User(String username, String passwordHash, int role, boolean isVerified, boolean isActive) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.isVerified = isVerified;
        this.isActive = isActive;
    }

    public User(){}
    public User(int userId , boolean isActive)
    {
        this.userId = userId;
        this.isActive = isActive;
    }

    public User(int userId, String username, boolean isActive, Date createdAt) {
        this.userId = userId;
        this.username = username;
        this.isActive = isActive;
        this.createdAt = createdAt;
    }
    
    
    
    public int login(String username , String passwordHash ,int role,Connection con)
    {
        int user_id = 0 ;
        try
        {
            String sql = "select * from login(?,?,?);";
            PreparedStatement ps = con.prepareStatement(sql);
            
            ps.setString(1,username);
            ps.setString(2,passwordHash);
            ps.setInt(3,role);
            
            ResultSet rs = ps.executeQuery();
            
            if(rs.next())
            {
                user_id = rs.getInt(1);
            }
            
            rs.close();
            ps.close();
            
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
        return user_id;
    }
}
