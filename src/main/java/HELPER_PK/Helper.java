package HELPER_PK;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import CUSTOMER_PK.*;

public class Helper {

    public static int checkUserEmailAndUsernameFound(String username, String email, Connection con) {
        int flag = 0;
        try {
            String sql = "select checkUserEmailAndUsernameFound(?,?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setString(1, username);
            ps.setString(2, email);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                flag = rs.getInt(1);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return flag;
    }

    public static CustomerParameters getCustomerParameters(int userId, Connection con) {
        CustomerParameters customer = null;

        try {
            String sql = "SELECT * FROM get_user_parameters(?)";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setInt(1, userId);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                customer = new CustomerParameters(
                        rs.getInt("R_customer_total_sent_sms"),
                        rs.getString("R_customer_last_sms_body"),
                        rs.getTimestamp("R_customer_last_sms_send_at"),
                        rs.getString("R_customer_to_number"),
                        rs.getString("R_customer_last_sms_status"),
                        userId,
                        rs.getInt("R_customer_id"),
                        rs.getBoolean("R_customer_is_active"),
                        rs.getString("R_customer_full_name")
                );
            }

            rs.close();
            ps.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return customer;
    }

    public static Customer GetCustomerData(int user_id, int customer_id, Connection con) {
        Customer customer = null;
        try {
            String sql = "select * from get_customer_data_by_ID(?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, user_id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                customer = new Customer(
                        customer_id,
                        rs.getString("R_full_name"),
                        rs.getDate("R_birth_date"),
                        rs.getString("R_phone_num"),
                        rs.getString("R_job_title"),
                        rs.getString("R_email"),
                        rs.getString("R_address"),
                        rs.getString("R_twilio_account_sid"),
                        rs.getString("R_twilio_auth_token"),
                        rs.getString("R_twilio_sender_id"),
                        user_id,
                        rs.getString("R_user_name"),
                        rs.getBoolean("R_is_active"),
                        rs.getDate("R_created_at")
                );
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return customer;
    }

    public static int saveSMS(int customer_id, String twilioSenderID, String to_number, String smsBody, String twilio_message_sid, Connection con) {
        int sms_id = 0;
        try {
            String sql = "select * from save_sms(?,?,?,?,?)";

            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, customer_id);
            ps.setString(2, twilioSenderID);
            ps.setString(3, to_number);
            ps.setString(4, smsBody);
            ps.setString(5, twilio_message_sid);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                sms_id = rs.getInt(1);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return sms_id;
    }

    public static boolean deleteSMSById(int smsId , Connection con) {
        String sql = "SELECT delete_sms_by_id(?)";

        try (PreparedStatement statement = con.prepareStatement(sql)) 
        {
            statement.setInt(1, smsId);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) 
            {
                return resultSet.getBoolean(1);
            }
        } 
        catch (Exception ex) 
        {
            ex.printStackTrace();
        }
        return false;
    }
    
    public static boolean deleteHistorySMSById(int smsId , Connection con) {
        String sql = "SELECT delete_sms_from_history_by_id(?)";

        try (PreparedStatement statement = con.prepareStatement(sql)) 
        {
            statement.setInt(1, smsId);

            ResultSet resultSet = statement.executeQuery();

            if (resultSet.next()) 
            {
                return resultSet.getBoolean(1);
            }
        } 
        catch (Exception ex) 
        {
            ex.printStackTrace();
        }
        return false;
    }
}
