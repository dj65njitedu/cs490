import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.io.PrintWriter;


public class Compiler {
    public static void main(String[] args) {
		String returnMessage = "";
		PrintWriter writer;
		try {
			//String preCode = "public class sourceCode { public static void main(String[] args) { System.out.println(" + args[1] + "("+args[2]+","+args[3]+"));} public static ";
			String preCode = "public class sourceCode { public static void main(String[] args) { System.out.println(" + args[1] + "("+args[2]+","+args[3]+"));} public static ";
			String endCode = "}";
			
			writer = new PrintWriter("/afs/cad/u/d/j/dj65/public_html/cs490/output/sourceCode.java", "UTF-8");
			writer.println(preCode);
			writer.println(args[0]); 
			writer.println(endCode); 
			writer.close();
			
			Runtime rt = Runtime.getRuntime();
			try {
				Process pr = rt.exec("javac /afs/cad/u/d/j/dj65/public_html/cs490/output/sourceCode.java");
				String s = null;
		        BufferedReader stdError = new BufferedReader(new InputStreamReader(pr.getErrorStream()));
		           while ((s = stdError.readLine()) != null) {
		        	   returnMessage += s+"\n";
		           }
			} catch (IOException e) {
				// TODO Auto-generated catch block
			}
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace(); 
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(returnMessage == ""){
			Runtime rt = Runtime.getRuntime();
			try {
				Process pr = rt.exec("java -cp /afs/cad/u/d/j/dj65/public_html/cs490/output/ sourceCode");
				String s = null;
				BufferedReader stdInput = new BufferedReader(new InputStreamReader(pr.getInputStream()));
		           while ((s = stdInput.readLine()) != null) {
		        	   returnMessage += s+"\n";
		           }
		        BufferedReader stdError = new BufferedReader(new InputStreamReader(pr.getErrorStream()));
		           while ((s = stdError.readLine()) != null) {
		        	   returnMessage += s+"\n";
		           }
			} catch (IOException e) {
				// TODO Auto-generated catch block
			}
			System.out.println(returnMessage);
		}
		else{
			System.out.println(returnMessage);
		}
		
    }
}  