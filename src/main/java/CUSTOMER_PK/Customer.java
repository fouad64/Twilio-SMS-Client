
package CUSTOMER_PK;

import USERS_PK.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Date;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

public class Customer extends User
{
    private int customer_id;
    private String fullName;
    private Date dob;
    private String phoneNumber;
    private String jobTitle;
    private String email;
    private String address;
    private String twilioAccountSID;
    private String twilioAuthToken;
    private String twilioSenderId;

    public Customer(String fullName, Date dob, String phoneNumber, String jobTitle, String email, String address, String twilioAccountSID, String twilioAuthToken, String twilioSenderId, String username, String passwordHash, int role, boolean isVerified, boolean isActive) {
        super(username, passwordHash, role, isVerified, isActive);
        this.fullName = fullName;
        this.dob = dob;
        this.phoneNumber = phoneNumber;
        this.jobTitle = jobTitle;
        this.email = email;
        this.address = address;
        this.twilioAccountSID = twilioAccountSID;
        this.twilioAuthToken = twilioAuthToken;
        this.twilioSenderId = twilioSenderId;
    }
    public Customer(){}
    public Customer(int user_id , int customer_id ,boolean isActive , String fullName)
    {
        super(user_id,isActive);
        this.customer_id = customer_id;
        this.fullName = fullName;
    }

    public Customer(int customer_id, String fullName, Date dob, String phoneNumber, String jobTitle, String email, String address, String twilioAccountSID, String twilioAuthToken, String twilioSenderId, int userId, String username, boolean isActive, Date createdAt) {
        super(userId, username, isActive, createdAt);
        this.customer_id = customer_id;
        this.fullName = fullName;
        this.dob = dob;
        this.phoneNumber = phoneNumber;
        this.jobTitle = jobTitle;
        this.email = email;
        this.address = address;
        this.twilioAccountSID = twilioAccountSID;
        this.twilioAuthToken = twilioAuthToken;
        this.twilioSenderId = twilioSenderId;
    }
    
    public int getCustomer_id() {
        return customer_id;
    }

    public void setCustomer_id(int customer_id) {
        this.customer_id = customer_id;
    }
   
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTwilioAccountSID() {
        return twilioAccountSID;
    }

    public void setTwilioAccountSID(String twilioAccountSID) {
        this.twilioAccountSID = twilioAccountSID;
    }

    public String getTwilioAuthToken() {
        return twilioAuthToken;
    }

    public void setTwilioAuthToken(String twilioAuthToken) {
        this.twilioAuthToken = twilioAuthToken;
    }

    public String getTwilioSenderId() {
        return twilioSenderId;
    }

    public void setTwilioSenderId(String twilioSenderId) {
        this.twilioSenderId = twilioSenderId;
    }

    
    
    public static int register(Customer cus,Connection con)
    {
        int cus_id = 0 ;
        
        try
        {
            String sql = "select register(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            
            PreparedStatement ps = con.prepareStatement(sql);
            
            ps.setString(1,cus.fullName);
            ps.setDate(2,new java.sql.Date(cus.getDob().getTime()));
            ps.setString(3,cus.phoneNumber);
            ps.setString(4,cus.jobTitle);
            ps.setString(5,cus.email);
            ps.setString(6,cus.address);
            ps.setString(7,cus.twilioAccountSID);
            ps.setString(8,cus.twilioAuthToken);
            ps.setString(9,cus.twilioSenderId);
            ps.setString(10,cus.getUsername());
            ps.setString(11,cus.getPasswordHash());
            ps.setInt(12,cus.getRole());
            ps.setBoolean(13,cus.isIsVerified());
            ps.setBoolean(14,cus.isIsActive());
            
            ResultSet rs = ps.executeQuery();
            
            if(rs.next())
            {
                cus_id = rs.getInt(1);
            }
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
        return cus_id;
    }

    public static boolean updateProfile_without_password(Customer cus , Connection con)
    {
        boolean update_status = false ;
        try
        {
            String sql = "select update_customer_profile_without_password(?,?,?,?,?,?,?,?,?,?)";
            
            PreparedStatement ps = con.prepareStatement(sql);
            
            ps.setInt(1,cus.customer_id);
            ps.setString(2,cus.fullName);
            ps.setDate(3,new java.sql.Date(cus.getDob().getTime()));
            ps.setString(4,cus.phoneNumber);
            ps.setString(5,cus.jobTitle);
            ps.setString(6,cus.email);
            ps.setString(7,cus.address);
            ps.setString(8,cus.twilioAccountSID);
            ps.setString(9,cus.twilioAuthToken);
            ps.setString(10,cus.twilioSenderId);
            
            ResultSet rs = ps.executeQuery();
            
            if(rs.next())
            {
                update_status = true ;
            }
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
        return update_status;
    }
    
    
    public static boolean updateProfile_with_password(Customer cus, Connection con)
    {
        boolean update_status = false;

        try
        {
            String sql =
                "select update_customer_profile_with_password(?,?,?,?,?,?,?,?,?,?,?,?)";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, cus.getCustomer_id());
            ps.setInt(2, cus.getUserId());
            ps.setString(3, cus.getFullName());
            ps.setDate(4, new java.sql.Date(cus.getDob().getTime()));
            ps.setString(5, cus.getPhoneNumber());
            ps.setString(6, cus.getJobTitle());
            ps.setString(7, cus.getEmail());
            ps.setString(8, cus.getAddress());
            ps.setString(9, cus.getTwilioAccountSID());
            ps.setString(10, cus.getTwilioAuthToken());
            ps.setString(11, cus.getTwilioSenderId());
            ps.setString(12, cus.getPasswordHash());

            ResultSet rs = ps.executeQuery();

            if (rs.next())
            {
                update_status = true;
            }
        }
        catch (Exception ex)
        {
            ex.printStackTrace();
        }

        return update_status;
    }
    
    public static boolean sendSMS(String twilioSid ,String twilioToken , String twilioSender , String to_number ,String msg)
    {
        boolean SendingStatus = false;
        try 
        {
            Twilio.init(twilioSid, twilioToken);
            Message message = Message.creator(
                    new PhoneNumber(to_number),
                    new PhoneNumber(twilioSender),
                    msg
            ).create();
            if (message.getSid() != null) 
            {
               SendingStatus = true;
            } 
        }
        catch (Exception ex) 
        {
           ex.printStackTrace();
        }
        return SendingStatus;
    }
}
