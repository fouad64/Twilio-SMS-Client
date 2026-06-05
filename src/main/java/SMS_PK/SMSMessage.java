package SMS_PK;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class SMSMessage {

    private int smsId;
    private String fromNumber;
    private String toNumber;
    private String body;
    private Date sentDate;
    private String status;
    private String twilioMessageSid;

    public int getSmsId() {
        return smsId;
    }

    public void setSmsId(int smsId) {
        this.smsId = smsId;
    }

    public String getFromNumber() {
        return fromNumber;
    }

    public void setFromNumber(String fromNumber) {
        this.fromNumber = fromNumber;
    }

    public String getToNumber() {
        return toNumber;
    }

    public void setToNumber(String toNumber) {
        this.toNumber = toNumber;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Date getSentDate() {
        return sentDate;
    }

    public void setSentDate(Date sentDate) {
        this.sentDate = sentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTwilioMessageSid() {
        return twilioMessageSid;
    }

    public void setTwilioMessageSid(String twilioMessageSid) {
        this.twilioMessageSid = twilioMessageSid;
    }

    public SMSMessage(int smsId, String fromNumber, String toNumber, String body, Date sentDate, String status, String twilioMessageSid) {
        this.smsId = smsId;
        this.fromNumber = fromNumber;
        this.toNumber = toNumber;
        this.body = body;
        this.sentDate = sentDate;
        this.status = status;
        this.twilioMessageSid = twilioMessageSid;
    }

    public static List<SMSMessage> GetAllSMSsByCustomerID(int cus_id, Connection con) 
    {
        List<SMSMessage> SMSs = new ArrayList();

        try 
        {
            String sql = "select * from GetSMSsByCustomerID(?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setInt(1, cus_id);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) 
            {
                SMSMessage sms = new SMSMessage
                (
                    rs.getInt("r_sms_id"),
                    rs.getString("r_sender"),
                    rs.getString("r_receiver"),
                    rs.getString("r_message_text"),
                    rs.getTimestamp("r_sent_date"),
                    rs.getString("r_status"),
                    rs.getString("r_twilio_message_sid")
                );
                
                SMSs.add(sms);
            }
        } 
        catch (Exception ex) {
            ex.printStackTrace();
        }
        return SMSs;
    }
}
