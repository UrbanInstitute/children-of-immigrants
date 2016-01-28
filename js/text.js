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
    main: ["All children", "Age 0 to 3", "Age 4 to 5", "Age 6 to 12", "Age 13 to 17"],
    //age: ["Age 0 to 3", "Age 4 to 5", "Age 6 to 12", "Age 13 to 17"],
    origin: ["Mexico", "Other Central America & Spanish Caribbean", "Europe, Canada, & Australia", "East Asia & Pacific", "Africa", "Middle East & South Asia", "South America", "Southeast Asia"],
    citizenship: ["Citizen with citizen parents", "Citizen with non-citizen parents", "Non-citizen"],
    edukids: ["Not in school, age 3 to 5", "Not in school, age 6 to 17"],
    edupar: ["No high school degree", "High school degree", "Bachelor's degree or more"],
    engkids: ["English proficient", "Not English proficient"],
    engpar: ["English proficient parents", "At least one parent who is not English proficient", "No English proficient parents", "Linguistically isolated households"],
    numkids: ["1", "2", "3-4", "5+"],
    numpar: ["One parent", "Two parents"],
    incbenefits: ["Family below the poverty line", "Family below 200% of the poverty line", "At least one working parent", "At least one working parent and below 200% of the poverty line", "Household owns home"]
};

//summary text for each category
var cattext = {
    main: "From 2006 to 2013, the number of children of immigrants grew from 15.7 million to 17.6 million. These children are clustered in six states that are traditional immigrant destinations: California, New York, New Jersey, Florida, Illinois, and Texas. Sixty-three percent of all children of immigrants live in just these six states.  Yet, many of these traditional immigrant destinations have not seen huge growth in the last several years and some nontraditional states, such as Washington and North Carolina, saw an increase in the share of children of immigrants. Below, you'll see what percentage of children in each state are born to immigrant parents, and how those percentages vary by age group.",
    //age: "Share of children in a certain age group that are children of immigrants.",
    origin: "Country of origin is particularly important from a policy perspective, as it influences the types of language accessibility programs necessary to serve students and their parents in a particular area. Nationwide, Mexico was the most common country of origin, but many of these immigrants cluster in Western states. In Texas in 2013, for example, 69 percent of immigrant parents came from Mexico. In New York in 2013, however, another traditional immigrant state, only 7 percent of children of immigrants had parents born in Mexico. In fact, there was no clear majority in New York; the largest share of immigrant parents came from Central America and the Spanish Caribbean, but still only accounted for 20 percent of the immigrant parent population. When parents are from different regions of birth, the child is assigned the region of birth of the mother.",
    citizenship: "Because citizenship often determines eligibility for federal programs aimed at low-income families, understanding the distribution of citizenship among children of immigrants is vital for making decisions about supplemental state programs for non-citizens. Non-citizen parents are less likely to participate in programs like SNAP or TANF even when their citizen children are eligible. The majority of children of immigrants, 57 percent, are citizens and have parents who are citizens. Another third of children of immigrants are citizens themselves but have non-citizen parents. Only 10 percent of children of immigrants are non-citizens themselves.  This share decreased from 14 in 2006 to 10 in 2013.",
    edukids: "English proficiency is important for language accessibility policies. The vast majority of children of immigrants are English proficient and the share has been growing over the last several years. The share of children of immigrants who are English proficient has increased from 81 percent in 2006 to 85 percent in 2013.",
    edupar: "A child’s chances of success are significantly increased if the child has a parent who has earned a college degree. Children of immigrants are less likely than children of native born parents to have a parent who has completed college. In 2013 32 percent of children of immigrants had at least one parent with a college degree or higher, compared to 38 percent of children of native-born parents.  In addition, children of immigrants are more likely than children of native-born parents to have parents with less than a high school degree. Specifically, 25 percent of children of immigrants have parents who have not earned a high school degree, compared to just 6 percent of children of native-born parents. The data below is based on the highest degree attained by either parent.",
    engkids: "English proficiency is important for language accessibility policies. In 2006, 19.4 percent of children of immigrants had limited English proficiency. In 2013, this number dropped to 15 percent.",
    engpar: "Parents with limited or no English proficiency are more likely to have trouble navigating schools, health providers, and other government and community programs and institutions. The majority of children of immigrants, 59 percent, have at least one English proficient parent. Still, in 2013, 22 percent of children of immigrants lived in linguistically isolated households, defined as households where there are no English-proficient family members over the age of 14.",
    numkids: "Children of immigrants are slightly more likely than other children to have a large number of siblings.  In 2013 20 percent of children of immigrants lived in families with only one child versus 24 percent of children of native born parents.",
    numpar: "Children of immigrants are much more likely to live in two-parent homes than children of native born parents. In 2013, 81 percent of children of immigrants lived in two-parent homes compared to just 68 percent of children of native-born parents.",
    incbenefits: "Children of immigrants are more likely to live in poor families. In 2013, 26 percent of children of immigrants lived in poor families compared to 19 percent of children of native-born parents.  The share of children of immigrants living in poor families has increased over the last several years.  In 2008, only 20 percent of children of immigrants lived in poverty."
};