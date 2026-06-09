package CUSTOMER_PK;

import DB_PK.DB;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.PreparedStatement;

@WebServlet("/AdminEditCustomerServlet")
public class AdminEditCustomerServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            int customerId = Integer.parseInt(request.getParameter("customerId"));
            int userId = Integer.parseInt(request.getParameter("userId"));
            String fullName = request.getParameter("fullName");
            String dob = request.getParameter("dob");
            String jobTitle = request.getParameter("jobTitle");
            String email = request.getParameter("email");
            String phone = request.getParameter("phone");
            String address = request.getParameter("address");
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            String twilioSid = request.getParameter("twilioSid");
            String twilioToken = request.getParameter("twilioToken");
            String twilioSender = request.getParameter("twilioSender");
            boolean isActive = Boolean.parseBoolean(request.getParameter("isActive"));

            // Safely open connection inside resource manager block
            try (Connection con = DB.getConnection()) {
                
                // 1. Update customer_profiles table
                String updateProfileSql = "UPDATE customer_profiles SET full_name = ?, birth_date = ?, "
                        + "phone_num = ?, job_title = ?, email = ?, address = ?, twilio_account_sid = ?, "
                        + "twilio_auth_token = ?, twilio_sender_id = ? WHERE customer_id = ?";
                
                try (PreparedStatement psProfile = con.prepareStatement(updateProfileSql)) {
                    psProfile.setString(1, fullName);
                    if (dob == null || dob.trim().isEmpty()) {
                        psProfile.setNull(2, java.sql.Types.DATE);
                    } else {
                        psProfile.setDate(2, java.sql.Date.valueOf(dob));
                    }
                    psProfile.setString(3, phone);
                    psProfile.setString(4, jobTitle);
                    psProfile.setString(5, email);
                    psProfile.setString(6, address);
                    psProfile.setString(7, twilioSid);
                    psProfile.setString(8, twilioToken);
                    psProfile.setString(9, twilioSender);
                    psProfile.setInt(10, customerId);
                    psProfile.executeUpdate();
                }

                // 2. Update users table (username, isActive, and password if provided)
                String updateUserSql;
                if (password != null && !password.trim().isEmpty()) {
                    updateUserSql = "UPDATE users SET user_name = ?, password_hash = ?, is_active = ? WHERE user_id = ?";
                    try (PreparedStatement psUser = con.prepareStatement(updateUserSql)) {
                        psUser.setString(1, username);
                        psUser.setString(2, password);
                        psUser.setBoolean(3, isActive);
                        psUser.setInt(4, userId);
                        psUser.executeUpdate();
                    }
                } else {
                    updateUserSql = "UPDATE users SET user_name = ?, is_active = ? WHERE user_id = ?";
                    try (PreparedStatement psUser = con.prepareStatement(updateUserSql)) {
                        psUser.setString(1, username);
                        psUser.setBoolean(2, isActive);
                        psUser.setInt(3, userId);
                        psUser.executeUpdate();
                    }
                }
            } // con closes here automatically and cleanly!

            out.print("{\"status\":\"success\"}");
            
        } catch (Exception ex) {
            ex.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"status\":\"error\", \"message\":\"" + ex.getMessage() + "\"}");
        }
    }
}