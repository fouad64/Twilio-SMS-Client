/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package SMS_PK;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import HELPER_PK.Helper;
import DB_PK.DB;
import java.sql.Connection;
public class DeleteSmsServlet extends HttpServlet 
{

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException 
    {
       String sms_id = request.getParameter("id");
       Connection con;
        try
        {
            con = DB.getConnection();
            boolean status = Helper.deleteSMSById(Integer.parseInt(sms_id), con);
            if(status)
            {
                response.sendRedirect(request.getContextPath() + "/HTML/SEARCHSMS.html");
            }
            else
            {
//                response.sendRedirect(request.getContextPath() + "/HTML/SEARCHSMS.html");
            }
        } 
        catch (ClassNotFoundException ex) 
        {
            System.getLogger(DeleteSmsServlet.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
        }
       
    }

}
