import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { commonFontStyle, hp, wp } from "../theme/fonts";
import { useTheme } from "@react-navigation/native";

const PrivacyPolicy = () => {
  const { colors } = useTheme();

  const styles = React.useMemo(() => getGlobalStyles({ colors }), [colors]);
  const onPressPlay = () => {
    Linking.openURL("https://www.google.com/policies/privacy/");
  };

  const onPressVsCode = () => {
    Linking.openURL("https://privacy.microsoft.com/en-us/privacystatement");
  };

  const onPressFarbic = () => {
    Linking.openURL("https://fabric.io/terms");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.innerContainerStyle}>
        <Text style={styles.textStyle}>
          {
            "1. Bengaluru Traffic Police has built this App as a free app for users. This SERVICE is provided by Karnataka State Police at no cost and is intended for use as is. Under no circumstances data will be used for any commercial purposes by Karnataka State Police.\n\nಬೆಂಗಳೂರು ಸಂಚಾರ ಪೊಲೀಸ್ ಈ ಉಚಿತ ಮೊಬೈಲ್ ತಂತ್ರಾಂಶವನ್ನು ಬಳಕೆದಾರರಿಗೆ ನಿರ್ಮಿಸಿದ್ದಾರೆ. ಈ ಸೇವೆಯನ್ನು ನೀಡುತ್ತಿರುವ ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಇಲಾಖೆಯು ಯಾವುದೇ ಶುಲ್ಕವನ್ನು ವಿಧಿಸುವದಿಲ್ಲ ಮತ್ತು ಹೇಗಿದೆಯೋ ಹಾಗೆ ಬಳಕೆಗೆ ಉದ್ದೇಶಿಸಲಾಗಿದ  ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೋಲಿಸ್ ಯಾವುದೇ ಸಂದರ್ಭಗಳಲ್ಲಿ ತಂತ್ರಾಂಶದ ಮಾಹಿತಿಯನ್ನು (Data) ಯಾವುದೇ ವಾಣಿಜ್ಯ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಬಳಸುವುದಿಲ್ಲ."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "2. This page is used to inform app users regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service.\n\nನಮ್ಮ ಸೇವೆಗಳನ್ನು ಈ ತಂತ್ರಾಂಶದ ಮೂಲಕ ಪಡೆಯಲು ಯಾರಾದರೂ ನಿರ್ಧರಿಸಿದ್ದಲ್ಲಿ ನಮ್ಮ ನೀತಿಗಳಿಗೆ ಸಂಬಂಧಿಸಿದಂತೆ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯ ಸಂಗ್ರಹ, ಬಳಕೆ ಮತ್ತು ಬಹಿರಂಗಪಡಿಸುವಿಕೆ ಬಗ್ಗೆ ಮೊಬೈಲ್ ತಂತ್ರಾಂಶದ ಬಳಕೆದಾರರು ಈ ಕೆಳಕಂಡ ಮಾಹಿತಿಯನ್ನು ಗಮನಿಸಲು ತಿಳಿಸಲಾಗಿದೆ."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "3. If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.\n\nನಮ್ಮ ಸೇವೆಯನ್ನು ಬಳಸಲು ನೀವು ಆರಿಸಿದ್ದಲ್ಲಿ, ನೀವು ಈ ನೀತಿಯ ಬಗ್ಗೆ ಮಾಹಿತಿ ಸಂಗ್ರಹಣೆ ಮತ್ತು ಬಳಕೆಗೆ ಸಮ್ಮತಿಸುತ್ತೀರಿ.  ನಾವು ಸಂಗ್ರಹಿಸುವ ಮಾಹಿತಿಯನ್ನು, ನಾವು ಒದಗಿಸುತ್ತಿರುವ ಸೇವೆಯನ್ನು ಮತ್ತು ಸುಧಾರಿಸಲು ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ.  ಈ ಗೌಪ್ಯತೆ ನೀತಿಯಲ್ಲಿ ವಿವರಿಸಿದಂತೆ ನಾವು ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ತಂತ್ರಾಂಶದ ಕಾರ್ಯನಿರ್ವಹಣೆಗಾಗಿ ಮಾತ್ರ ಬಳಸಲಾಗುವುದು ಮತ್ತು ಇತರರಿಗೆ ಈ ಮಾಹಿತಿಯನ್ನು ಲಭ್ಯಪಡಿಸುವುದಿಲ್ಲ.  "
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "4. Information Collection and Use\nFor a better user experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to Name, Mobile Number, Address, Gender and G.P.S Location. The information that we collect will be retained by us in the servers located in our premises in India and managed by us and will be used as described in this document.\n\nಮಾಹಿತಿ ಸಂಗ್ರಹಿಸುವಿಕೆ ಮತ್ತು ಬಳಕೆ\nನಮ್ಮ ಸೇವೆಗಳನ್ನು ಬಳಕೆದಾರರಿಗೆ ಉತ್ತಮ ರೀತಿಯಲ್ಲಿ ನೀಡುವ ಸಲುವಾಗಿ ಅವರ ಹೆಸರು, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ, ವಿಳಾಸ, ಜಿ.ಪಿ.ಎಸ್, ಇತ್ಯಾದಿ ವೈಯಕ್ತಿಕ ವಿವರಗಳ ಅವಶ್ಯಕತೆಯಿರುತ್ತದೆ.  ನಾವು ಸಂಗ್ರಹಿಸಿದ ಮಾಹಿತಿಯು ಭಾರತದ ಗುರುತಿಸಿರುವ ಸ್ಥಳದಲ್ಲಿ ಅಳವಡಿಸಿರುವ ಸರ್ವರ್ ಗಳಲ್ಲಿ ನಮ್ಮಿಂದ ಉಳಿಸಿಕೊಳ್ಳುಲಾಗುವುದು ಮತ್ತು ನಮ್ಮಿಂದ ನಿರ್ವಹಿಸಲಾಗುವುದು ಮತ್ತು ಈ ದಾಖಲೆಯಲ್ಲಿ ವಿವರಿಸಿದಂತೆ ಅದನ್ನು ಬಳಸಲಾಗುತ್ತದೆ."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "5. The app does use third party services that may collect information used to identify you.\nLink to privacy policy of third party service providers used by the app"
          }
        </Text>
        <Text onPress={onPressPlay} style={styles.blueText}>
          {"Google Play Services"}
        </Text>
        <Text onPress={onPressVsCode} style={styles.blueText}>
          {"Visual Studio App Center"}
        </Text>
        <Text onPress={onPressFarbic} style={styles.blueText}>
          {"Fabric"}
        </Text>
        <Text style={styles.textStyle}>
          {
            "ಈ ಮೊಬೈಲ್ ತಂತ್ರಾಂಶವು ಬಳಕೆದಾರು ಸಲ್ಲಿಸಬಹುದಾದ ಕೆಲವೊಂದು ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಕೆಳಗೆ ನಮೂದಿಸಿದ Third-Party Services ರವರಿಗೆ ಲಭ್ಯವಿರುತ್ತದೆ.\nಈ ಮೊಬೈಲ್ ತಂತ್ರಾಂಶವು ಬಳಸುವ ಮೂರನೇ ಪಕ್ಷದ ಸೇವಾ ಪೂರೈಕೆದಾರರ ಗೌಪ್ಯತಾ ನೀತಿಯ ಲಿಂಕ್ ಕೆಳಕಂಡಂತಿವೆ"
          }
        </Text>
        <Text onPress={onPressPlay} style={styles.blueText}>
          {"Google Play Services"}
        </Text>
        <Text onPress={onPressVsCode} style={styles.blueText}>
          {"Visual Studio App Center"}
        </Text>
        <Text onPress={onPressFarbic} style={styles.blueText}>
          {"Fabric"}
        </Text>
        <View style={{ height: hp(2) }} />
        <Text style={styles.textStyle}>
          {
            "6. Log Data\nWe want to inform you that whenever you use our Service, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. This Log Data is anonymous and may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "ಲಾಗ್ ಮಾಹಿತಿ\nನೀವು ಈ ತಂತ್ರಾಂಶದ ಸೇವೆಗಳನ್ನು ಬಳಸುವಾಗ ಯಾವುದಾದರು ದೋಷ ಕಂಡುಬಂದಲ್ಲಿ ಸದರಿ ದೋಷವನ್ನು ನಿವಾರಿಸುವ ನಿಟ್ಟಿನಲ್ಲಿ ಅದಕ್ಕೆ ಸಂಬಂಧಪಟ್ಟ “Log Data” ಅನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುವುದು ಮತ್ತು ಅದನ್ನು ಬಳಸಿಕೊಂಡು ತಂತ್ರಾಂಶದಲ್ಲಿ ಸದರಿ ದೋಷವು ಪುನರಾವರ್ತಿಯಾಗದಂತೆ ಕ್ರಮ ಜರುಗಿಸಿ ಉಪಯೋಗ ಮಾಡಲಾಗುವುದು."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "7. Cookies\nCookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your device internal memory. This Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and to improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "8. Service Providers\n We may employ third-party companies and individuals due to the following reasons:"
          }
        </Text>
        <Text style={styles.subTextStyle}>{"To facilitate our Service;"}</Text>
        <Text style={styles.subTextStyle}>
          {"To provide the Service on our behalf;"}
        </Text>
        <Text style={styles.subTextStyle}>
          {"To perform Service-related services; or"}
        </Text>
        <Text style={styles.subTextStyle}>
          {"To assist us in analyzing how our Service is used."}
        </Text>
        <Text style={styles.textStyle}>
          {
            "ಸೇವೆ ಒದಗಿಸುವವರು\n ನಾವು third-party companies and individuals ಗಳನ್ನು ಈ ಕೆಳಗಿನ ಕಾರಣಗಳಿಂದ ನೇಮಿಸಬಹುದು:"
          }
        </Text>
        <Text style={styles.subTextStyle}>{"ನಮ್ಮ ಸೇವೆಯನ್ನು ಅನುಕೂಲಕ್ಕಾಗಿ"}</Text>
        <Text style={styles.subTextStyle}>{"ನಮ್ಮ ಪರವಾಗಿ ಸೇವೆ ಒದಗಿಸಲು"}</Text>
        <Text style={styles.subTextStyle}>
          {"ಸೇವೆ-ಸಂಬಂಧಿತ ಸೇವೆಗಳನ್ನು ನಿರ್ವಹಿಸಲು; ಅಥವಾ"}
        </Text>
        <Text style={styles.subTextStyle}>
          {"ನಮ್ಮ ಸೇವೆ ಹೇಗೆ ಬಳಸಲಾಗಿದೆ ಎಂಬುದನ್ನು ವಿಶ್ಲೇಷಿಸುವಲ್ಲಿ ನಮಗೆ ಸಹಾಯ ಮಾಡಲು"}
        </Text>
        <View style={{ height: hp(2) }} />
        <Text style={styles.textStyle}>
          {
            "9. We want to inform users of this Service that these third parties may have access to your Personal Information with our consent. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "ತಂತ್ರಾಂಶದ ಬಳಕೆದಾರರು ಸಲ್ಲಿಸಿದ ಮಾಹಿತಿಯನ್ನು ನಮ್ಮ ಒಪ್ಪಿಗೆಯೊಂದಿಗೆ third party services providers ಗೆ ನಿಯೋಜಿಸಿದ ಕಾರ್ಯಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಸದರಿ ಮಾಹಿತಿಯನ್ನು ಪರಾಮರ್ಶಿಸಬಹುದಾಗಿದೆ.  ಆದರೆ, ಅವರು ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ಸದರಿ ಮಾಹಿತಿಯನ್ನು ಅನ್ಯರಿಗೆ ತಿಳಿಸಬಾರದೆಂಬ ನಿರ್ಭಂದಕ್ಕೆ ಒಳಗಾಗಿರುತ್ತಾರೆ."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "10. Security\nWe value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it and also comply with mandatory government regulations.  But users are requested to note that information over internet can be prone for compromises, on occasions, various cyber security measures."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "ಭದ್ರತೆ\nತಂತ್ರಾಂಶವನ್ನು ಬಳಸಲು ನೀವು ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಿ ಈ ಸೇವೆಗಳಲ್ಲಿ ನಂಬಿಕೆಯಿಟ್ಟಿದ್ದು,  ನಾವು ಸದರಿ ಮಾಹಿತಿಯನ್ನು ಎಲ್ಲಾ ರೀತಿಯಲ್ಲಿ ಕಾಪಾಡಲು ಕ್ರಮ ಜರುಗಿಸಿದ್ದು ಮತ್ತು ಈ ನಿಟ್ಟಿನಲ್ಲಿ ಸರ್ಕಾರವು ನೀಡಿದ ಸೂಚನೆಗಳೊಂದಿಗೆ ಅದನ್ನು ಸಂರಕ್ಷಿಸಲು ಕ್ರಮ ತೆಗೆದುಕೊಂಡಿದೆ.  ಆದರೆ, ಅಂತರ್ಜಾಲದಲ್ಲಿ ಸೇವೆಗಳನ್ನು ಪಡೆಯಲು ಎಲ್ಲಾ ಬಳಕೆದಾರರು ಗಮನಿಸಬೇಕಾಗಿದ್ದು, ಅಂತರ್ಜಾಲದಲ್ಲಿರುವ ಮಾಹಿತಿ ಎಲ್ಲಾ ಜಗೃತಿಗಳನ್ನು ತೆಗೆದುಕೊಂಡಾಗಲೂ ಸಹ ಕೆಲವೊಮ್ಮೆ ಕೆಲವು ಮಾಹಿತಿ ಸೋರಿಕೆಯಾಗುವ ಸಾಧ್ಯತೆಗಳಿವೆ. "
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "11. Links to Other Sites\nThis app does not contain links to any other third-party applications."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "ಇತರೆ ವೆಬ್‍ಸೈಟ್‍ಗಳಿಗೆ ಲಿಂಕ್‍ಗಳು\nಈ ಸೇವೆಯು ಯಾವುದೇ ಇತರ ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಅಪ್ಲಿಕೇಶನ್‌ಗಳಿಗೆ ಲಿಂಕ್‌ಗಳನ್ನು ಹೊಂದಿಲ್ಲ."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "12. Children’s Privacy\nThese Services do not specifically address any underage children. We do not knowingly collect personally identifiable information from children. If on being notified or detected that a child has provided us with personal information, we will remove the data. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to take necessary actions."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "ಈ ತಂತ್ರಾಂಶವು  ಮಕ್ಕಳಿಂದ ವೈಯಕ್ತಿಕವಾಗಿ ಗುರುತಿಸಬಹುದಾದ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.  ಮಕ್ಕಳು ನಮಗೆ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಿದ್ದಾರೆ ಎಂದು ತಿಳಿಸಿದರೆ ಅಥವಾ ಪತ್ತೆಹಚ್ಚಿದಲ್ಲಿ, ನಾವು ಆ ಮಾಹಿತಿಯನ್ನು (ಡೇಟಾವನ್ನು) ತೆಗೆದುಹಾಕುತ್ತೇವೆ.  ಪೋಷಕರು ಅಥವಾ ರಕ್ಷಕರಾಗಿದ್ದರೆ ಮತ್ತು ನಿಮ್ಮ ಮಗು ನಮಗೆ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಿದೆ ಎಂದು ತಿಳಿದಿದ್ದರೆ, ದಯವಿಟ್ಟು ನೀವು ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿದ್ದಲ್ಲಿ, ನಾವು ಅಗತ್ಯ ಕ್ರಮ ಜರುಗಿಸುತ್ತೇವೆ."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "13. Anonymous Reporting Privacy\nThe app allows the user to report anonymously, identity of the reported users will not be displayed to Unit Officers, however the data will be present on the servers."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "ಗೌಪ್ಯ ವರದಿಗಳು\n  ಬಳಕೆದಾರರು ಗೌಪ್ಯವಾಗಿಯು ವರದಿ ಮಾಡಲು ಅವಕಾಶವಿರುತ್ತದೆ, ಗೌಪ್ಯ ವರದಿ ಮಾಡಿದಲ್ಲಿ ಬಳಕೆದಾರರ ವ್ಯೆಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಅಧಿಕಾರಿಗಳಿಗೆ ತೋರಿಸಲಾಗುವುದಿಲ್ಲ. ಆದರೆ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ ಸರ್ವರ್ ನಲ್ಲಿ ಲಭ್ಯವಿರುತ್ತದೆ."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "14. Changes to this Privacy Policy\nWe may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "ಈ ಗೌಪ್ಯತಾ ನೀತಿಗೆ ಬದಲಾವಣೆಗಳು\n  ನಾವು ಕಾಲಕಾಲಕ್ಕೆ ನಮ್ಮ ಗೌಪ್ಯತಾ ನೀತಿಯನ್ನು ನವೀಕರಿಸಬಹುದು.  ಹೀಗಾಗಿ, ಈ ಪುಟವನ್ನು ನಿಯತಕಾಲಿಕವಾಗಿ ಯಾವುದೇ ಬದಲಾವಣೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ನಿಮಗೆ ಸೂಚಿಸಲಾಗಿದೆ.  ಈ ಪುಟದಲ್ಲಿ ಗೌಪ್ಯತೆ ನೀತಿಯ ಬದಲಾವಣೆಗಳನ್ನು ಮಾಡಿದಾಗ, ಅದರ ಮಾಹಿತಿಯನ್ನು ನಾವು ತಿಳಿಸುತ್ತೇವೆ.   ಈ ಪುಟದಲ್ಲಿ ಪೋಸ್ಟ್ ಮಾಡಿದ ಬದಲಾವಣೆಗಳು, ತಕ್ಷಣದಿಂದಲೇ ಜಾರಿಗೆ ಬರುತ್ತದೆ."
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "15. Contact Us\nIf you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.\n\nOrganization Email: jtcptrafficbcp@ksp.gov.in\nDeveloper Email: reeshabh.thakur@arcadis.com"
          }
        </Text>
        <Text style={styles.textStyle}>
          {
            "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ\n ನಮ್ಮ ಗೌಪ್ಯತಾ ನೀತಿ ಬಗ್ಗೆ ನೀವು ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳನ್ನು ಅಥವಾ ಸಲಹೆಗಳನ್ನು ಹೊಂದಿದ್ದರೆ, ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಲು ಹಿಂಜರಿಯಬೇಡಿ.\n\nಇಲಾಖೆಯ ಇ-ಮೇಲ್ ವಿಳಾಸ: jtcptrafficbcp@ksp.gov.in\nಡೆವಲಪರ್ ಇ-ಮೇಲ್ ವಿಳಾಸ: reeshabh.thakur@arcadis.com"
          }
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const getGlobalStyles = (props: any) => {
  const { colors } = props;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    textStyle: {
      ...commonFontStyle(600, 12, colors.black),
      marginBottom: hp(2),
    },
    innerContainerStyle: {
      paddingHorizontal: wp(4),
      marginTop: hp(2),
    },
    boldTextStyle: {
      ...commonFontStyle(700, 12, colors.black),
    },
    blueText: {
      ...commonFontStyle(700, 12, colors.blue20),
      textDecorationLine: "underline",
      marginBottom: hp(1),
    },
    subTextStyle: {
      ...commonFontStyle(600, 12, colors.black),
      marginBottom: hp(0.5),
    },
  });
};

export default PrivacyPolicy;
