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
    main: ["Share of all children with immigrant parents", "Total number", "Children of immigrants by residence"],
    age: ["Age 0 to 3", "Age 4 to 5", "Age 6 to 12", "Age 13 to 17"],
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
    main: "From 2011 to 2013, the number of children of immigrants grew from 17.2 million to 17.6 million. As before, these children continue to be clustered in six states that are traditional immigrant destinations: California, New York, New Jersey, Florida, Illinois, and Texas. Yet, percentage of children of immigrants in California has declined from 2006 to 2013 and some nontraditional states, such as Kansas and South Carolina, saw an increase in the share of children of immigrants. Below, you'll see what percentage of children in each state are born to immigrant parents, and what percentage of all children of immigrants live in each state.",
    age: "Share of children in a certain age group that are children of immigrants.",
    origin: "Country of origin is particularly important from a policy perspective, as it influences the types of language accessibility programs necessary to serve students and their parents in a particular area. Nationwide, Mexico was the most common country of origin, but many of these immigrants cluster in Western states. In Texas, for example, 69 percent of immigrant parents came from Mexico. In New York, however, another traditional immigrant state, only 9 percent of children of immigrants had parents born in Mexico. In fact, there was no clear majority in New York; the largest share of immigrant parents came from Central America and the Spanish Caribbean, but still only accounted for 20 percent of the immigrant parent population. When parents are from different regions of birth, the child is assigned the region of birth of the mother.",
    citizenship: "Because citizenship often determines eligibility for federal programs aimed at low-income families, understanding the distribution of citizenship among children of immigrants is vital for making decisions about supplemental state programs for non-citizens. The share of children of immigrants who are citizens with citizen parents increased from 55 percent in 2006 to 57 percent in 2013. Yet, the share of children of immigrants who are citizens with non-citizen parents also increased, from 31 percent in 2006 to 33 percent in 2013. Non-citizen parents are less likely to participate in programs like SNAP or TANF even when their citizen children are eligible.",
    edukids: "School participation rates for children of immigrants have been increasing since 2006. Nearly all children of immigrants ages 6 to 17 are in school—just 1.75 percent are not, a smaller share than that of children of native born parents who are not in school. But for younger children, the story is different. Nationwide, just 59.3 percent of children of immigrants attend school, and the school-going rate is lower than for children of native born parents.",
    edupar: "A child’s chances of success are significantly increased if the child has a parent who has earned a college degree. While the share of children of immigrants with at least one college educated parent has grown, children of immigrants are still less likely than children of native born parents to have a parent who has completed college. Across the United States, 24.5 percent of children of immigrants have parents who have not earned a high school degree. The data below is based on the highest degree attained by either parent.",
    engkids: "English proficiency is important for language accessibility policies. In 2006, 19.4 percent of children of immigrants had limited English proficiency. In 2013, this number dropped to 15 percent.",
    engpar: "Parents with limited or no English proficiency are more likely to have trouble navigating schools, health providers, and other government and community programs and institutions. The share of children of immigrants who have no English-speaking parent has remained relatively steady since 2006, hovering around 44 percent. Simultaneously, the percentage of children of immigrants who have at least one parent with limited English proficiency fell only slightly, from 61 percent in 2006 to 58.1 percent in 2013. Despite the static number of English-proficient parents, however, there has been a noticeable drop in the number of children of immigrants living in linguistically isolated households, defined as households where there are no English-proficient family members over the age of 14. ",
    numkids: "Children of immigrants are more likely than other children to have a large number of siblings, with 64 percent of children of immigrants living in families with more than four children versus 50 percent of children of native born parents. It follows, then, that most households that include a child of immigrant parents actually include 2-4 children; only about 20 percent of these households are single-child homes.",
    numpar: "Children of immigrants are much more likely to live in two-parent homes than children of native born parents. While the share of children of immigrants with single parents is increasing, that growth is slow in most of the country. In 2013, however, that share of children of immigrants living in one-parent households jumped to 25.5 percent in New York and 23 percent in Florida, substantially higher than the national average of 19.1 percent.",
    incbenefits: "While there has been an overall increase since 2006 in the share of children living below the poverty line, children of immigrants have been especially affected. In 2006, 22 percent of children of immigrants lived in poverty, while in 2013, 26 percent did. (That number did stabilize between 2011 and 2013, however, reflecting the economic recovery.) The trend was similar for children of native born parents: in 2006, 15.9 percent lived in poverty, while by 2013 that share had increased to 18.9 percent."
};