import RegistrationForm from "../features/auth/components/RegistrationForm";
import {usePageTitle} from "../app/customHooks/usePageTitle.ts";

export default function Registration() {
    usePageTitle("TrackerApp | Sign Up")
  return <RegistrationForm />;
}
