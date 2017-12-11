//labels and text for categories and metrics - baking this into the html for now
/*
var catname = {
    main: "Population",
    origin: "Country of origin",
    citizenship: "Citizenship",
    edukids: "Education of children",
    edupar: "Education of parents",
    engkids: "English proficiency of children",
    engpar: "English proficiency of parents",
    numkids: "Number of children in household",
    numpar: "Number of parents in household",
    incbenefits: "Income and benefits"
};
*/

//text for levels of categories - make all edits here
var levels = {
    main: ["All children", "Ages 0 to 3", "Ages 4 to 5", "Ages 6 to 12", "Ages 13 to 17"],
    //age: ["Age 0 to 3", "Age 4 to 5", "Age 6 to 12", "Age 13 to 17"],
    origin: ["Mexico", "Other Central America and Spanish Caribbean", "Europe, Canada, and Australia", "East Asia and Pacific", "Africa", "Middle East and South Asia", "South America", "Southeast Asia"],
    citizenship: ["Citizen with citizen parents", "Citizen with noncitizen parents", "Noncitizen"],
    edukids: ["Not in school, ages 3 to 5", "Not in school, ages 6 to 17"],
    edupar: ["No high school degree", "High school degree", "Bachelor's degree or more"],
    engkids: ["English proficient", "Not English proficient"],
    engpar: ["English-proficient parents", "At least one parent who is not English proficient", "No English-proficient parents", "Linguistically isolated households"],
    numkids: ["1", "2", "3-4", "5+"],
    numpar: ["One parent", "Two parents"],
    incbenefits: ["Family below the federal poverty level", "Family below 200% of the federal poverty level", "At least one working parent", "At least one working parent and below 200% of the federal poverty level", "Household owns home"]
};

//summary text for each category
var cattext = {
    main: "From 2006 to 2015, the number of children of immigrants grew from 16.0 million to 18.2 million. These children are clustered in six states that are traditional immigrant destinations: California, New York, New Jersey, Florida, Illinois, and Texas. Sixty-two percent of all children of immigrants live in these six states alone. But many of these traditional immigrant destinations have not seen huge growth in the past several years, and some nontraditional states, such as Washington and North Carolina, have seen an increase in the share of children of immigrants. Below, you'll see what percentage of children in each state are born to immigrant parents and how those percentages vary by age group.",
    //age: "Share of children in a certain age group that are children of immigrants.",
    origin: "Country of origin is particularly important to policy because it influences the types of language accessibility programs necessary to serve children and their parents in a particular area. Nationwide, Mexico was the most common country of origin, but many of these immigrants cluster in Western states. In Texas, for example, 66 percent of immigrant parents in 2015 came from Mexico. However, in the traditional immigrant destination of New York, only 9 percent of children of immigrants in 2014 had parents born in Mexico. In fact, New York had no clear majority for parent’s country of origin; the largest share of children of immigrants had parents from Central America and the Spanish Caribbean, which still only accounted for 20 percent of the immigrant parent population. When parents are from different regions, the child is assigned the mother’s region of origin.",
    citizenship: "Because citizenship often determines eligibility for federal programs aimed at low-income families, understanding the distribution of citizenship among children of immigrants is vital for making decisions about supplemental state programs for noncitizens. Noncitizen parents are less likely to participate in programs like the Supplemental Nutrition Assistance Program or Temporary Assistance for Needy Families, even when their citizen children are eligible. As of 2015, 59 percent of children of immigrants were citizens and had parents who were citizens, and another 32 percent of children of immigrants were citizens but had noncitizen parents. Only 9 percent of children of immigrants were noncitizens; this share decreased from 14 percent in 2006.",
    edukids: "School enrollment rates are similar for children of immigrants and children of native-born parents. Nearly all children ages 6 to 17 are enrolled in school. Though enrollment rates for younger children are lower&mdash;around 60 percent for children between ages 3 and 5—children of immigrant parents and of native-born parents still enroll at similar rates.",
    edupar: "A child’s chances of success significantly increase if the child has a parent with a college degree. Children of immigrants are less likely than children of native-born parents to have a parent who has completed college. In 2015, 34 percent of children of immigrants had at least one parent with a college degree or greater, compared with 40 percent of children of native-born parents. In addition, children of immigrants are more likely than children of native-born parents to have parents with less than a high school degree. Specifically, 23 percent of children of immigrants have parents who have not earned a high school degree, compared with just 6 percent of children of native-born parents. The data below consider the highest degree attained by either parent.",
    engkids: "English proficiency is important for language accessibility policies. The vast majority of children of immigrants are English proficient, and the share has been growing over the last several years. The share of children of immigrants who are English proficient has increased from 81 percent in 2006 to 86 percent in 2015.",
    engpar: "Parents with limited or no English proficiency are more likely to have trouble navigating schools, health providers, and other government and community programs and institutions. Sixty percent of children of immigrants have at least one English-proficient parent. Still, in 2015, 21 percent of children of immigrants lived in linguistically isolated households (households in which there are no English-proficient family members over age 14).",
    numkids: "Children of immigrants are slightly more likely than other children to have many siblings. In 2015, 21 percent of children of immigrants lived in families with only one child compared with 24 percent of children of native-born parents.",
    numpar: "Children of immigrants are much more likely to live in two-parent homes than children of native-born parents. In 2015, 82 percent of children of immigrants lived in two-parent homes compared with just 69 percent of children of native-born parents.",
    incbenefits: "Children of immigrants are more likely to live in poor families. In 2015, 24 percent of children of immigrants lived in poor families compared with 18 percent of children of native-born parents. The share of children of immigrants living in poor families has increased over the past several years: in 2006, only 22 percent of children of immigrants lived in poverty."
};