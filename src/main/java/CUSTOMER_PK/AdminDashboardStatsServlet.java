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
import java.util.HashMap;
import java.util.Map;

@WebServlet("/AdminDashboardStatsServlet")
public class AdminDashboardStatsServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();
        
        Map<String, Object> stats = new HashMap<>();
        
        try (Connection con = DB.getConnection()) {
            
            // Total Customers
            String sql1 = "SELECT COUNT(*) as total FROM customer_profiles";
            try (PreparedStatement ps1 = con.prepareStatement(sql1);
                 ResultSet rs1 = ps1.executeQuery()) {
                if (rs1.next()) {
                    stats.put("totalCustomers", rs1.getInt("total"));
                } else {
                    stats.put("totalCustomers", 0);
                }
            }
            
            // Total SMS Messages
            String sql2 = "SELECT COUNT(*) as total FROM sms_messages";
            try (PreparedStatement ps2 = con.prepareStatement(sql2);
                 ResultSet rs2 = ps2.executeQuery()) {
                if (rs2.next()) {
                    stats.put("totalMessages", rs2.getInt("total"));
                } else {
                    stats.put("totalMessages", 0);
                }
            }
            
            // Most Active Customer
            String sql3 = "SELECT cp.full_name, COUNT(sm.sms_id) AS cnt " +
                         "FROM customer_profiles cp " +
                         "INNER JOIN users u ON cp.user_id = u.user_id " +
                         "INNER JOIN sms_messages sm ON cp.customer_id = sm.customer_id " +
                         "GROUP BY cp.customer_id, cp.full_name " +
                         "ORDER BY cnt DESC " +
                         "LIMIT 1";
            
            String mostActiveCustomer = "N/A";
            try (PreparedStatement ps3 = con.prepareStatement(sql3);
                 ResultSet rs3 = ps3.executeQuery()) {
                if (rs3.next()) {
                    mostActiveCustomer = rs3.getString("full_name");
                    if (mostActiveCustomer == null || mostActiveCustomer.trim().isEmpty()) {
                        mostActiveCustomer = "N/A";
                    }
                }
            }
            stats.put("mostActiveCustomer", mostActiveCustomer);
            
            // Send JSON response
            out.print(gson.toJson(stats));
            
        } catch (Exception ex) {
            ex.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            
            Map<String, Object> errorStats = new HashMap<>();
            errorStats.put("totalCustomers", 0);
            errorStats.put("totalMessages", 0);
            errorStats.put("mostActiveCustomer", "N/A");
            errorStats.put("error", ex.getMessage());
            
            out.print(gson.toJson(errorStats));
        }
    }
}