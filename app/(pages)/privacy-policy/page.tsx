import { CheckCircle } from "lucide-react";
import PrivacyPolicyHero from "./components/hero";

export default function page() {
  return (
    <div>
      <PrivacyPolicyHero />
      <div className="bg-card w-full py-8">
        <div className="w-full max-w-4xl mx-auto p-6 border  rounded-md shadow-md  ">
          {/* Terms and Conditions Text */}
          <div className="mb-6  text-default-700 text-base leading-relaxed space-y-14">
            <p className="mb-4 font-medium text-default-900">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <p className="mb-4">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt.
            </p>
            <ul className="list-disc list-inside mb-4 space-y-4">
              <li className="flex gap-4 items-start gap">
                <span>
                  <CheckCircle className="text-info" />
                </span>
                <p>
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores.
                </p>
              </li>
              <li className="flex gap-4 gap-2 items-start gap">
                <span>
                  <CheckCircle className="text-info" />
                </span>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium.
                </p>
              </li>
              <li className="flex gap-4 items-start gap">
                <span>
                  <CheckCircle className="text-info" />
                </span>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit.
                </p>
              </li>
              <li className="flex gap-4 items-start gap">
                <span>
                  <CheckCircle className="text-info" />
                </span>
                <p>
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores.
                </p>
              </li>
            </ul>
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button className="px-4 py-2 text-base font-medium text-default-600 border border-default-300 rounded hover:bg-default-100">
              Not right now...
            </button>
            <button className="px-4 py-2 text-base font-medium text-primary-foreground bg-blue-600 rounded hover:bg-blue-700">
              I agree with terms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
