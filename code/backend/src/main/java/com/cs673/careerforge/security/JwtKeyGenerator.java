package com.cs673.careerforge.security;

import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import javax.crypto.SecretKey;
import java.util.Base64;

/**To use this, run mvn compile exec:java -Dexec.mainClass="com.cs673.careerforge.security.JwtKeyGenerator"
 */
public class JwtKeyGenerator {
    public static void main(String[] args) {
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // 256-bit key
        String base64Key = Base64.getEncoder().encodeToString(key.getEncoded());
        System.out.println("Your JWT secret key:\n" + base64Key);
    }
}
