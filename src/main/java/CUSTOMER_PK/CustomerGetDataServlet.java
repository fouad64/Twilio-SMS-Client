/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package CUSTOMER_PK;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import HELPER_PK.Helper;
import DB_PK.DB;
import jakarta.servlet.http.HttpSession;
import java.sql.Connection;
public class CustomerGetDataServlet extends HttpServlet {

 
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException 
    {
       response.setContentType("application/json");
       response.setCharacterEncoding("UTF-8");
       PrintWriter out = response.getWriter();
       Gson gson = new Gson();
       try
       {
          Connection con = DB.getConnection();
          HttpSession session = request.getSession(false);
          Integer user_id = (Integer) session.getAttribute("login_user_id");
          Integer customer_id = (Integer) session.getAttribute("Customer_id");
          Customer customer = Helper.GetCustomerData(user_id,customer_id, con);
          if(customer != null)
          {
              out.print(gson.toJson(customer));
          }
       }
       catch(Exception ex)
       {
           ex.printStackTrace();
       }
       
       
    }

 

}
