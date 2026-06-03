package USERS_PK;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import HELPER_PK.Helper;
import DB_PK.DB;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import java.sql.Connection;

public class UserRegisterServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String fullName = request.getParameter("fullName");
        String dob = request.getParameter("dob");
        String jobTitle = request.getParameter("jobTitle");
        String email = request.getParameter("email");
        String otpCode = request.getParameter("otp");
        String phone = request.getParameter("phone");
        String address = request.getParameter("address");
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String twilioSid = request.getParameter("twilioSid");
        String twilioToken = request.getParameter("twilioToken");
        String twilioSender = request.getParameter("twilioSender");

        try {
            Connection con = DB.getConnection();
            int validation_id = Helper.checkUserEmailAndUsernameFound(username, email, con);
            switch (validation_id) {
                case 1:
                    HttpSession session = request.getSession();

                    session.setAttribute("fullName", fullName);
                    session.setAttribute("dob", dob);
                    session.setAttribute("jobTitle", jobTitle);
                    session.setAttribute("email", email);
                    session.setAttribute("phone", phone);
                    session.setAttribute("address", address);
                    session.setAttribute("username", username);
                    session.setAttribute("password", password);
                    session.setAttribute("twilioSid", twilioSid);
                    session.setAttribute("twilioToken", twilioToken);
                    session.setAttribute("twilioSender", twilioSender);
                    session.setAttribute("otpCode", otpCode);
                    System.out.println("otpCode = " + otpCode);
                    try {
                        Twilio.init(twilioSid, twilioToken);
                        Message message = Message.creator(
                                new PhoneNumber(phone),
                                new PhoneNumber(twilioSender),
                                "Your Verification Code Is : " + otpCode
                        ).create();
                        if (message.getSid() != null) {
                            response.sendRedirect(request.getContextPath() + "/HTML/VERIFY.html");
                        } else {
                            response.sendRedirect(request.getContextPath() + "/HTML/twilio-missing-parameters.html");
                        }
                    } catch (Exception e) {
                        response.sendRedirect(request.getContextPath() + "/HTML/twilio-missing-parameters.html");
                    }

                    response.sendRedirect(request.getContextPath() + "/HTML/VERIFY.html");
                    break;
                default:
                    response.sendRedirect(request.getContextPath() + "/HTML/account-exists.html");
            }
            con.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

    }

}
