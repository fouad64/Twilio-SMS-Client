package CUSTOMER_PK;

import HELPER_PK.Helper;
import DB_PK.DB;
import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/CustomerGetParametersServlet")
public class CustomerGetParametersServlet extends HttpServlet
{
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException
    {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Gson gson = new Gson();

        HttpSession session = request.getSession(false);

        if (session == null)
        {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"error\":\"Session not found\"}");
            return;
        }

        Integer user_id = (Integer) session.getAttribute("login_user_id");
        System.out.println("user_id  : " + user_id);
        if (user_id == null)
        {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().print("{\"error\":\"User not authenticated\"}");
            return;
        }

        try (Connection con = DB.getConnection();
             PrintWriter out = response.getWriter())
        {
            CustomerParameters customer = Helper.getCustomerParameters(user_id,con);

            if (customer != null)
            {
                HttpSession cus_session = request.getSession(false);
                cus_session.setAttribute("Customer_id",customer.getCustomer_id());
                
                out.print(gson.toJson(customer));
            }
            else
            {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\"error\":\"Customer not found\"}");
            }

            out.flush();
            con.close();
        }
        catch (Exception ex)
        {
            ex.printStackTrace();

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

            response.getWriter().print(
                    "{\"error\":\"Internal server error\"}"
            );
        }
    }
}
