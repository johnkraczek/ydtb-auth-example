import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Button,
  Text,
} from "jsx-email";
import * as React from "react";

export interface PassResetEmailProps {
  baseURL: string;
  validationLink: string;
}

export const PassResetEmail = ({
  baseURL,
  validationLink,
}: PassResetEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <div style={gap}></div>
      <Container style={container}>
        <Img
          src="https://jsx.email/assets/demo/plaid-logo.png"
          // src={`${baseURL}plaid-logo.png`}
          width="212"
          height="88"
          alt="Plaid"
          style={logo}
        />
        <Text style={tertiary}>Your Digital Toolbox</Text>
        <Heading style={secondary}>
          Click the button to
          <br />
          reset your password
        </Heading>

        <Section style={codeContainer}>
          <Button href={validationLink} style={button}>
            Reset Password
          </Button>
        </Section>
        <Text style={paragraph}>
          <br />
          Link expires in after 60 minutes.
        </Text>
        <Text style={paragraph}>
          <br />
          Not expecting this email?
        </Text>
        <Text style={paragraph}>
          <br />
          If you didn't request this,
          <br /> you can safely ignore this email.
        </Text>
      </Container>
      <Text style={paragraph}>
        <br />
        Need to copy and paste the link?
        <br />
        {validationLink}
      </Text>
      <Text style={footer}>Securely powered by Your Digital Toolbox.</Text>
    </Body>
  </Html>
);

PassResetEmail.PreviewProps = {
  validationCode: "4dd9a92d",
  validationLink: "https://localhost:3000/new-verification?token='4dd9a92d'",
  baseURL: "http://localhost:3000/assets/img/",
} as PassResetEmailProps;

export default PassResetEmail;

const main = {
  backgroundColor: "#dddddd",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  margin: "50px 0",
};

const gap = {
  height: "50px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  marginTop: "50px",
  width: "360px",
  margin: "0 auto",
  padding: "68px 0 50px",
};

const logo = {
  margin: "0 auto",
};

const tertiary = {
  color: "#0a85ea",
  fontSize: "11px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  height: "16px",
  letterSpacing: "0",
  lineHeight: "16px",
  margin: "16px 8px 8px 8px",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
};

const secondary = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Medium,Helvetica,Arial,sans-serif",
  fontSize: "20px",
  fontWeight: 500,
  lineHeight: "24px",
  width: "100%",
  marginBottom: "0",
  marginTop: "0",
  textAlign: "center" as const,
};

const codeContainer = {
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  width: "280px",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  letterSpacing: "0",
  lineHeight: "23px",
  padding: "0 40px",
  margin: "0",
  textAlign: "center" as const,
};

const link = {
  color: "#444",
  textDecoration: "underline",
};

const footer = {
  color: "#000",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0",
  lineHeight: "23px",
  margin: "0",
  marginTop: "20px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
};

const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "12px 24px",
  boxShadow: "0 5px 10px rgba(20,50,70,.3)",
};
