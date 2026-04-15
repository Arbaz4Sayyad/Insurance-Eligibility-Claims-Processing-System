import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Base64;
import java.io.FileOutputStream;

public class KeyGenerator {
    public static void main(String[] args) throws Exception {
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(2048);
        KeyPair keyPair = keyPairGenerator.generateKeyPair();
        
        byte[] publicKey = keyPair.getPublic().getEncoded();
        byte[] privateKey = keyPair.getPrivate().getEncoded();
        
        try (FileOutputStream fos = new FileOutputStream("public_key.der")) {
            fos.write(publicKey);
        }
        try (FileOutputStream fos = new FileOutputStream("private_key.der")) {
            fos.write(privateKey);
        }
        
        System.out.println("RSA Keys generated successfully in DER format.");
        System.out.println("Public Key (Base64): " + Base64.getEncoder().encodeToString(publicKey));
    }
}
