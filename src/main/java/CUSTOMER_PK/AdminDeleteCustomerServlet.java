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

@WebServlet("/AdminDeleteCustomerServlet")
public class AdminDeleteCustomerServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        String userIdStr = request.getParameter("userId");
        if (userIdStr == null || userIdStr.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Missing userId parameter.\"}");
            return;
        }

        try (Connection con = DB.getConnection()) {
            int userId = Integer.parseInt(userIdStr);
            
            // Delete customer profile first due to foreign key constraints
            String deleteProfileSql = "DELETE FROM customer_profiles WHERE user_id = ?";
            try (PreparedStatement ps1 = con.prepareStatement(deleteProfileSql)) {
                ps1.setInt(1, userId);
                ps1.executeUpdate();
            }

            // Cleanly clear the parent user log
            String deleteUserSql = "DELETE FROM users WHERE user_id = ?";
            try (PreparedStatement ps2 = con.prepareStatement(deleteUserSql)) {
                ps2.setInt(1, userId);
                int rows = ps2.executeUpdate();
                
                if (rows > 0) {
                    out.print("{\"status\":\"success\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"status\":\"error\",\"message\":\"User not found.\"}");
                }
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"status\":\"error\",\"message\":\"" + ex.getMessage() + "\"}");
        }
    }
}