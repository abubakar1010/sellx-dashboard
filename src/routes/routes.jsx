/* eslint-disable no-unused-vars */
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import DashboardHome from "../page/DashboardHome/DashboardHome";
import ForgetPassword from "../page/Auth/ForgetPassword/ForgetPassword";
import SignIn from "../page/Auth/SignIn/SignIn";
import Otp from "../page/Auth/Otp/Otp";
import NewPassword from "../page/Auth/NewPassword/NewPassword";
import PersonalInformationPage from "../page/PersonalInformation/PersonalInformationPage";
import SettingsPage from "../page/Settings/SettingsPage";
import AboutUsPage from "../page/AboutUs/AboutUsPage";
import EditAboutUs from "../page/EditAboutUs/EditAboutUs"; 
import PrivacyPolicyPage from "../page/PrivacyPolicy/PrivacyPolicyPage";
import EditPersonalInformationPage from "../page/EditPersonalInformationPage/EditPersonalInformationPage";
import EditPrivacyPolicy from "../page/EditPrivacyPolicy/EditPrivacyPolicy";
import TermsConditions from "../page/TermsConditions/TermsConditions";
import EditTermsConditions from "../page/EditTermsConditions/EditTermsConditions";
import Notification from "../component/Main/Notification/Notification";
import EarningsPage from "../page/EarningsPage/EarningsPage";
import UsersPage from "../page/Users/UsersPage";
import ListingsPage from "../page/ListingsPage/ListingsPage";
import CategoriesPage from "../page/CategoriesPage/CategoriesPage";
import StoriesPage from "../page/StoriesPage/StoriesPage";
import ProfessionalStoresPage from "../page/ProfessionalStoresPage/ProfessionalStoresPage";
import ProStoresDetailsPage from "../page/ProfessionalStoresPage/ProStoresDetailsPage";
import Overview from "../component/Main/ProfessionalStores/Overview";
import Listings from "../component/Main/Listings/Listings";
import Payments from "../component/Main/ProfessionalStores/Payments";
import Ads from "../component/Main/ProfessionalStores/Ads";
import ListingsPro from "../component/Main/ProfessionalStores/ListingsPro";
import ListingsDetails from "../component/Main/ProfessionalStores/ListingsDetails";
import Details from "../component/Main/Listings/Details";
import SubscriptionsPage from "../page/SubscriptionsPage/SubscriptionsPage";
import AdminRoutes from './AdminRoutes'
import AddSubscriptions from "../component/Main/addSubscriptions/addSubscriptions";
import EditSubscriptions from "../component/Main/editSubscriptions/editSubscriptions";
import UsersDetailes from "../component/Main/Users/usersDetailes";
import Coupon from "../component/Main/Coupon/Coupon";
import Boosting from "../component/Main/Boosting/Boosting";
import Advertisement from "../component/Main/Advertisement/Advertisement";
import ListingPackagesPage from "../page/ListingPackagesPage/ListingPackagesPage";
import StoryPackagesPage from "../page/StoryPackagesPage/StoryPackagesPage";
import ListingPurchasesPage from "../page/ListingPurchasesPage/ListingPurchasesPage";
import StoryPurchasesPage from "../page/StoryPurchasesPage/StoryPurchasesPage";
import UserSubscriptionsPage from "../page/UserSubscriptionsPage/UserSubscriptionsPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AdminRoutes>
      <MainLayout />
      </AdminRoutes>
    ),
    errorElement: <h1>Error</h1>,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path:"/boosting",
        element: <Boosting />
      },
      {
        path: "users/:id",
        element: <UsersDetailes />,
      },
      {
        path:"Coupon",
        element: <Coupon></Coupon>
      },
      {
        path: "Earnings",
        element: <EarningsPage />,
      },
      {
        path: "listing-packages",
        element: <ListingPackagesPage />,
      },
      {
        path: "story-packages",
        element: <StoryPackagesPage />,
      },
      {
        path: "listing-purchases",
        element: <ListingPurchasesPage />,
      },
      {
        path: "story-purchases",
        element: <StoryPurchasesPage />,
      },
      {
        path: "user-subscriptions",
        element: <UserSubscriptionsPage />,
      },
      {
        path: "stories",
        element: <StoriesPage />,
      },
      {
        path: "professional-stores",
        element: <ProfessionalStoresPage />,
      },
      {
        path: "professional-stores/:id",
        element: <ProStoresDetailsPage />,
        children: [
          {
            index: true,
            element: <Overview />
          },
          {
            path: "listing",
            children: [
              {
                index: true,
                element: <ListingsPro />
              },
              {
                path: ":listingId",
                element: <ListingsDetails />
              }
            ]
          },
          {
            path: "ads",
            element: <Ads />
          },
          {
            path: "payments",
            element: <Payments />
          },
        ]
      },
      {
        path: "listings",
        element: <ListingsPage />
      }, 
       {
        path: "listings/:id",
        element: <Details />
      }, 
      {
        path: "categories",
        element: <CategoriesPage />
      }, 
      {
        path: "subscriptions", 
        element: <SubscriptionsPage />
      },
      {
        path: "AddSubscriptions",
        element: <AddSubscriptions />
      },
      {
        path:"subscriptions/:id",
        element: <EditSubscriptions />
      },
      {
        path:"/advertisement",
        element: <Advertisement />
      },
      {
        path: "personal-info",
        element: <PersonalInformationPage />,
      },
      {
        path: "edit-personal-info",
        element: <EditPersonalInformationPage />,
      },
      {
        path: "/notification",
        element: <Notification />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "settings/privacy-policy",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "/settings/edit-privacy-policy/:id",
        element: <EditPrivacyPolicy />,
      },
      {
        path: "settings/terms-conditions",
        element: <TermsConditions />,
      },
      {
        path: "/settings/edit-terms-conditions/:id",
        element: <EditTermsConditions />,
      },
      {
        path: "settings/about-us",
        element: <AboutUsPage />,
      },{
        path: "/settings/edit-about-us/:id",
        element: <EditAboutUs/>
      },
    ],
  },
  {
    path: "/auth",
    errorElement: <h1>Auth Error</h1>,
    children: [
      {
        index: true,
        element: <SignIn />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "otp/:email",
        element: <Otp />,
      },
      {
        path: "new-password/:email",
        element: <NewPassword />,
      },
    ],
  },
]);

export default router;
