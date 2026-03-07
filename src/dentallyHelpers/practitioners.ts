import { axiosDentallyInstance, DENTALLY_ENDPOINTS } from "@/config/api-config"
import { DATA_TYPE, dentallyErrorHelper } from "./errorHelpers"

export async function gettPractitionerById(practitionerId: string) {
    const response = await axiosDentallyInstance.get(DENTALLY_ENDPOINTS.practitioner.get(practitionerId))
    return dentallyErrorHelper(response, DATA_TYPE.PRACTITIONER)
}

export async function getPractitioners(siteIds: string[], singleSiteId: string | null, createdAfter: string | null, updatedAfter: string | null) {
    const dentallyParams = new URLSearchParams()

    if (siteIds.length > 0) {
        siteIds.forEach(id => dentallyParams.append("site_id[]", id))
    } else if (singleSiteId) {
        dentallyParams.append("site_id", singleSiteId)
    }

    if (createdAfter) {
        dentallyParams.append("created_after", createdAfter)
    }

    if (updatedAfter) {
        dentallyParams.append("updated_after", updatedAfter)
    }

    const response = await axiosDentallyInstance.get(DENTALLY_ENDPOINTS.practitioner.list(dentallyParams))
    return dentallyErrorHelper(response, DATA_TYPE.PRACTITIONERS)
}

export async function patchPractitionerById(practitionerId: string,partialPractitioner:any) {
    const response = await axiosDentallyInstance.patch(DENTALLY_ENDPOINTS.practitioner.edit(practitionerId),partialPractitioner)
    return dentallyErrorHelper(response, DATA_TYPE.PRACTITIONER)
}