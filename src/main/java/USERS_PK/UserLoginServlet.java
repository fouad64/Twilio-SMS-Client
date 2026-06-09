package USERS_PK;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import DB_PK.DB;
import jakarta.servlet.http.HttpSession;
import java.sql.Connection;

public class UserLoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        Connection con = null;
        try 
        {
            con = DB.getConnection();
            String userType = request.getParameter("userType");

            String username = request.getParameter("username");
            String password = request.getParameter("password");
            int role = Integer.parseInt(userType);

            User user = new User();

            int user_id = user.login(username, password, role, con);
            
            if(user_id <= 0)
            {
                response.sendRedirect(request.getContextPath() + "/HTML/login-failed.html");
            }
            else
            {
                if(role == 1)
                {
                    response.sendRedirect(request.getContextPath() + "/HTML/ADMIN.html");
                }
                else if (role == 2)
                {
                    HttpSession session = request.getSession(true);
                    session.setAttribute("login_user_id", user_id);
                    response.sendRedirect(request.getContextPath() + "/HTML/CUSTOMER.html");
                }
            } 
        } 
        catch (Exception ex) 
        {
            ex.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/HTML/login-failed.html");
        }
        finally {
            if (con != null) {
                try { con.close(); } catch (Exception ignored) {}
            }
        }
    }

}
