package CUSTOMER_PK;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import DB_PK.DB;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/AdminGetCustomersServlet")
public class AdminGetCustomersServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();
        
        try (Connection con = DB.getConnection()) {
            String sql = "SELECT cp.customer_id, cp.user_id, cp.full_name, cp.birth_date, cp.phone_num, " +
                         "cp.job_title, cp.email, cp.address, cp.twilio_account_sid, cp.twilio_auth_token, " +
                         "cp.twilio_sender_id, u.user_name, u.is_active, u.created_at " +
                         "FROM customer_profiles cp " +
                         "JOIN users u ON cp.user_id = u.user_id " +
                         "ORDER BY cp.customer_id DESC";
                         
            try (PreparedStatement ps = con.prepareStatement(sql);
                 ResultSet rs = ps.executeQuery()) {
                 
                List<Customer> list = new ArrayList<>();
                while (rs.next()) {
                    Customer customer = new Customer(
                        rs.getInt("customer_id"),
                        rs.getString("full_name"),
                        rs.getDate("birth_date"),
                        rs.getString("phone_num"),
                        rs.getString("job_title"),
                        rs.getString("email"),
                        rs.getString("address"),
                        rs.getString("twilio_account_sid"),
                        rs.getString("twilio_auth_token"),
                        rs.getString("twilio_sender_id"),
                        rs.getInt("user_id"),
                        rs.getString("user_name"),
                        rs.getBoolean("is_active"),
                        rs.getTimestamp("created_at")
                    );
                    list.add(customer);
                }
                out.print(gson.toJson(list));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + ex.getMessage() + "\"}");
        }
    }
}